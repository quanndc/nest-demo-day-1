import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileTypePipe } from 'src/pipes/file-type/file-type.pipe';
import { StorageService } from 'src/services/storage/storage.service';

@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    @Post('upload')
    // Luôn nhận file theo mảng (mặc định client sẽ gửi 1 mảng các file, có thể là mảng 1 file)
    // Không cần tách 2 endpoint upload single và upload multiple
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFile(@UploadedFiles(
        new FileTypePipe(['image/png', 'image/jpeg'])
    ) files: Express.Multer.File[]) {
        // Mặc định là luôn upload nhiều file
        const imageUrl = await this.storageService.uploadMutilFilesWithPromiseAll(files, 'avatars');
        return imageUrl;
    }

    @Post('upload-video')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadVideo(@UploadedFiles(
        new FileTypePipe(['video/mp4', 'video/avi', 'video/mkv', 'video/mov', 'video/quicktime'])
    ) files: Express.Multer.File[], @Body() body: any) {
        // Mặc định là luôn upload nhiều file
        const videoUrl = await this.storageService.processAndUpload(files[0], 'videos');
        return { videoUrl } ;
    }
}
