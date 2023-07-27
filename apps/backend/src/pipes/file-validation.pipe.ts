import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  async transform(file: Express.Multer.File) {
    const ft = (await import('file-type')).default;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxFileSize = 10000000;

    const fileType = await ft.fileTypeFromBuffer(file.buffer);
    if (!fileType || !allowedTypes.includes(fileType.mime)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    if (file.size > maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${maxFileSize} bytes`,
      );
    }

    return file;
  }
}
