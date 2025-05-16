import { Module } from '@nestjs/common';
import { TaskgroupService } from './taskgroup.service';
import { TaskgroupController } from './taskgroup.controller';

@Module({
  providers: [TaskgroupService],
  controllers: [TaskgroupController]
})
export class TaskgroupModule {}
