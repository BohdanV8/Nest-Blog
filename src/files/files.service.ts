import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}
  getAvatarStorage() {
    return diskStorage({
      destination: '../uploads/avatars',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    });
  }

  getPostsMediaStorage() {
    return diskStorage({
      destination: '../uploads/posts',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.originalname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    });
  }
}
