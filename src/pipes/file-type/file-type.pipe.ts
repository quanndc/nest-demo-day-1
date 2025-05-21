import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { fromBuffer } from 'file-type';

@Injectable()
export class FileTypePipe implements PipeTransform {
  constructor(private allowedTypes: string[]) { }

  async transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {

    if (!files) {
      throw new BadRequestException('No file uploaded');
    }

    // Lấy hết các file type trong mảng files ra
    const fileTypes = await Promise.all(
      files.map(async (file) => {
        const fileType = await fromBuffer(file.buffer);
        return fileType;
      }),
    );

    if (!fileTypes || fileTypes.some((fileType) => !fileType)) {
      throw new BadRequestException('Unable to determine file type');
    }

    // Kiểm tra xem file type có nằm trong danh sách cho phép hay không
    // Nếu không có file nào nằm trong danh sách cho phép thì trả về lỗi
    // Kiểm tra tất cả các file type trong mảng fileTypes, nếu có 1 file không nằm trong danh sách cho phép thì trả về lỗi
    if (!fileTypes.every((fileType) => this.allowedTypes.includes(fileType!.mime))) {
      throw new BadRequestException(`Only PNG and JPEG files are allowed`);
    }
    return files;
  }
}
