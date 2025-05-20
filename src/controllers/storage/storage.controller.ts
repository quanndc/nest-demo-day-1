import { BadRequestException, Controller, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileTypeResult, fromBuffer } from 'file-type';
import { StorageService } from 'src/services/storage/storage.service';

@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        
        // Validate file type using file-type
        const fileType: FileTypeResult | undefined = await fromBuffer(file.buffer);

        if (!fileType) {
            throw new BadRequestException('Unable to determine file type');
        }

        // Example: Allow only PNG and JPEG files
        const allowedMimeTypes = ['image/png', 'image/jpeg'];
        if (!allowedMimeTypes.includes(fileType.mime)) {
            throw new BadRequestException(`Invalid file type: ${fileType.mime}`);
        }

        const imageUrl = await this.storageService.uploadFile(file, 'avatars');
        return imageUrl;
    }

    @Post('upload-multi')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadMultiFile(@UploadedFiles() files: Express.Multer.File[]) {
        console.log(files);
        if (!files) {
            throw new BadRequestException('No file uploaded');
        }

        // take all file types
        const fileTypes = await Promise.all(
            files.map(async (file) => {
                const fileType: FileTypeResult | undefined = await fromBuffer(file.buffer);
                return fileType;
            }),
        );

        if (!fileTypes || fileTypes.some((fileType) => !fileType)) {
            throw new BadRequestException('Unable to determine file type');
        }

        // Example: Allow only PNG and JPEG files
        const allowedMimeTypes = ['image/png', 'image/jpeg'];
        if (!fileTypes.some((fileType) => allowedMimeTypes.includes(fileType!.mime))) {
            throw new BadRequestException(`Only PNG and JPEG files are allowed`);
        }

        const imageUrl = await this.storageService.uploadMutilFilesWithPromiseAll(files, 'avatars');
        return imageUrl;
    }


}
