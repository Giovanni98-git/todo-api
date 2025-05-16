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
import { TaskService } from './task.service';
import { AuthGuard } from '@nestjs/passport';
import { TaskDto } from './dto/Task.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll() {
    return this.taskService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createTaskDto: TaskDto, @Req() request: Request) {
    const userId = request.user && request.user['id'];
    return this.taskService.create(createTaskDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) taskid: number, @Req() request: Request) {
    const userId = request.user && request.user['id'];
    return this.taskService.delete(taskid, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  update(
    @Param('id', ParseIntPipe) taskid: number,
    @Body() updateTaskDto: TaskDto,
    @Req() request: Request,
  ) {
    const userId = request.user && request.user['id'];
    return this.taskService.update(taskid, updateTaskDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }
}
