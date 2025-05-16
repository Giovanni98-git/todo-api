import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { MailDto } from './dto/mail.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MailService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    createMailDto: MailDto,
    userMail: string,
    files: Express.Multer.File[],
  ) {
    const { title, message, emailTo, emailsCC, emailCci } = createMailDto;
    const user = await this.prismaService.user.findUnique({
      where: { email: userMail },
    });
    if (!user) {
      throw new BadRequestException('Sender not found');
    }

    const recipient = await this.prismaService.user.findUnique({
      where: { email: emailTo },
    });

    if (!recipient) {
      throw new BadRequestException(
        `Recipient with email ${emailTo} not found`,
      );
    }
    const fileMap =
      files?.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
      })) || [];

    const attachements = fileMap.toString();

    const essai = JSON.parse(attachements);

    const mail = await this.prismaService.mail.create({
      data: {
        title,
        message,
        emailTo,
        emailsCC,
        emailCci,
        attachements,
      },
    });

    return {
      message: 'Mail created successfully',
      mailId: mail.id,
    };
  }

  async findOne(id: number, userMail: string) {
    return await this.prismaService.mail.findUnique({
      where: {
        id: id,
      },
    });
  }
  delete(mailId: number, userMail: string) {
    throw new Error('Method not implemented.');
  }
  findAllByUser(_userMail: string) {
    throw new Error('Method not implemented.');
  }
}
