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
  UseGuards,
} from '@nestjs/common';
import { TaskgroupService } from './taskgroup.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskGroupDto } from './dto/TaskGroup.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Groups')
@Controller('groups')
export class TaskgroupController {
  constructor(private readonly taskGroupService: TaskgroupService) {}

  @Get()
  getAll() {
    return this.taskGroupService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createTaskGroupDto: TaskGroupDto, @Req() request: Request) {
    const userId = request.user && request.user['id'];
    return this.taskGroupService.create(createTaskGroupDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) taskGroupId: number, @Req() request: Request) {
    const userId = request.user && request.user['id'];
    return this.taskGroupService.delete(taskGroupId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  update(
    @Param('id', ParseIntPipe) taskGroupId: number,
    @Body() updateTaskGroupDto: TaskGroupDto,
    @Req() request: Request,
  ) {
    const userId = request.user && request.user['id'];
    return this.taskGroupService.update(taskGroupId, updateTaskGroupDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskGroupService.findOne(id);
  }
}
