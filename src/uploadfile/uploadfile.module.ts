import { Global, Module } from '@nestjs/common';
import { UploadfileService } from './uploadfile.service';
import { UploadfileController } from './uploadfile.controller';

@Global()
@Module({
  providers: [UploadfileService],
  controllers: [UploadfileController]
})
export class UploadfileModule {}
