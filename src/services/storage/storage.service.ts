import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
const execAsync = promisify(exec);
@Injectable()
export class StorageService {
    constructor(private supabaseService: SupabaseService) {
    }



    private getFileUrl(filePath: string, bucket: string) {
        const { data } = this.supabaseService.supabaseClient
            .storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    }

    // cach 1 dùng promise.all để chạy đồng thời các hàm upload 1 lúc -> tăng tốc độ nhưng mất thứ tự
    async uploadMutilFilesWithPromiseAll(files: Express.Multer.File[], bucket: string) {
        const fileUrls = await Promise.all(
            files.map(async (file) => {
                const { data, error } = await this.supabaseService.supabaseClient
                    .storage
                    .from(bucket)
                    .upload(file.originalname, file.buffer, { cacheControl: '1800', upsert: true, contentType: file.mimetype });

                if (error) {
                    throw new Error(`Error uploading multi file: ${error.message}`);
                }
                const filePath = data.path;
                return this.getFileUrl(filePath, bucket);
            }),
        );
        return fileUrls;
    }

    // cach 2 dùng for await of để chạy tuần tự các hàm upload 1 lúc -> đảm bảo thứ tự, tốc độ chậm hơn
    async uploadMutilFilesWithForLoop(files: Express.Multer.File[], bucket: string) {
        const fileUrls: string[] = [];
        for (const file of files) {
            const { data, error } = await this.supabaseService.supabaseClient
                .storage
                .from(bucket)
                .upload(file.originalname, file.buffer, { cacheControl: '1800', upsert: true, contentType: file.mimetype });

            if (error) {
                throw new Error(`Error uploading file: ${error.message}`);
            }
            const filePath = data.path;
            const fileUrl = this.getFileUrl(filePath, bucket);
            fileUrls.push(fileUrl);
        }
        return fileUrls;
    }

    

    async processAndUpload(file: Express.Multer.File, body: any): Promise<string> {
    const uploadDir = path.join(__dirname, '../../tmp', Date.now().toString());

    try {
      // Kiểm tra ffmpegInstaller
      if (!ffmpegInstaller || !ffmpegInstaller.path) {
        throw new InternalServerErrorException(
          'FFmpeg not found. Ensure @ffmpeg-installer/ffmpeg is installed or FFmpeg is available in PATH.',
        );
      }

      // Tạo thư mục tạm
      fs.mkdirSync(uploadDir, { recursive: true });

      // Lưu file tạm
      const inputPath = path.join(uploadDir, file.originalname);
      fs.writeFileSync(inputPath, file.buffer);

      // Chuyển sang HLS
      const outputPath = path.join(uploadDir, 'output.m3u8');
      const ffmpegPath = ffmpegInstaller.path;
      const command = `${ffmpegPath} -i "${inputPath}" -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls "${outputPath}"`;

      await execAsync(command);

      // Kiểm tra xem file .m3u8 có được tạo không
      if (!fs.existsSync(outputPath)) {
        throw new InternalServerErrorException('Failed to generate HLS playlist');
      }

      // Upload tất cả file trong uploadDir lên Supabase
      const files = fs.readdirSync(uploadDir);
      const folderName = `my-video-${Date.now()}`;
      for (const f of files) {
        const filePath = path.join(uploadDir, f);
        const fileBuffer = fs.readFileSync(filePath);
        const { error } = await this.supabaseService.supabaseClient.storage
          .from('videos')
          .upload(`${folderName}/${f}`, fileBuffer, { upsert: true });

        if (error) {
          throw new InternalServerErrorException(`Failed to upload ${f}: ${error.message}`);
        }
      }

      // Lấy public URL file .m3u8
      const { data } = this.supabaseService.supabaseClient.storage
        .from('videos')
        .getPublicUrl(`${folderName}/output.m3u8`);

      if (!data?.publicUrl) {
        throw new InternalServerErrorException('Failed to retrieve public URL');
      }

      return data.publicUrl;
    } catch (error) {
      // Ghi log lỗi để debug
      console.error('Error in processAndUpload:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to process and upload video',
      );
    } finally {
      // Xóa thư mục tạm bất kể thành công hay thất bại
      if (fs.existsSync(uploadDir)) {
        fs.rmSync(uploadDir, { recursive: true, force: true });
      }
    }
  }

}
