import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MailDto } from './dto/mail.dto';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('user')
  findAllByUser(@Req() request: Request) {
    const userMail = request.user && request.user['email'];
    return this.mailService.findAllByUser(userMail);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('attachements', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          let randomName =
            'IMG_' + Date.now() + '_' + Math.round(Math.random() * 1e9);
          cb(null, randomName + extname(file.originalname));
        },
      }),
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(
    @Body() createMailDto: MailDto,
    @Req() request: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userMail = request.user && request.user['email'];
    return this.mailService.create(createMailDto, userMail, files);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userMail = request.user && request.user['email'];
    return this.mailService.delete(id, userMail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userMail = request.user && request.user['email'];
    return this.mailService.findOne(id, userMail);
  }
}
