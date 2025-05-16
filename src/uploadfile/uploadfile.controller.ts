import { BadRequestException, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('uploadfile')
export class UploadfileController {

    @UseInterceptors(
        FileInterceptor('file',
            {storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    let randomName = 'IMG_' + Date.now() + '_' + Math.round(Math.random() * 1e9);
                    cb(null, randomName + extname(file.originalname));
                }
            })}
        ))
    @Post('upload')
    upload(@UploadedFile() file: Express.Multer.File){
        return {
            name: file.originalname,
            size: file.size,
            type: file.mimetype,
            newFileName: file.filename
        }
    }
    
    @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          let randomName = 'IMG_' + Date.now() + '_' + Math.round(Math.random() * 1e9);
          cb(null, randomName + extname(file.originalname));
        },
      }),
    }),
  )
  @Post('uploads')
  uploads(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const fileMap: { [key: string]: string } = {};
    files.forEach((file) => {
      fileMap[file.originalname] = file.filename;
    });

    return {
      message: 'Files uploaded successfully',
      files: fileMap,
    };
  } 
}
