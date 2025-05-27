import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

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
                    .upload(file.originalname, file.buffer, {cacheControl: '3600',upsert: true, contentType: file.mimetype});

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
                .upload(file.originalname, file.buffer, {cacheControl: '3600',upsert: true, contentType: file.mimetype});

            if (error) {
                throw new Error(`Error uploading file: ${error.message}`);
            }
            const filePath = data.path;
            const fileUrl = this.getFileUrl(filePath, bucket);
            fileUrls.push(fileUrl);
        }
        return fileUrls;
    }
}
