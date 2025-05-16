import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskDto } from './dto/Task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return await this.prismaService.task.findMany({
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assigned: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async create(createTaskDto: TaskDto, userId: number) {
    const { title, description, dueDate, priority, groupId, assignedId } =
      createTaskDto;

    if (!title) {
      throw new NotFoundException('title is required');
    }

    await this.prismaService.task.create({
      data: {
        title: title,
        description: description || null,
        dueDate: dueDate || null,
        creatorId: userId,
        priority: priority || null,
        groupId: groupId || null,
        assignedId: assignedId || null,
      },
    });

    return { message: 'Task created successfully' };
  }

  async delete(taskid: number, userId: number) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskid,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.creatorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this task',
      );
    }
    await this.prismaService.task.delete({
      where: {
        id: taskid,
      },
    });
    return { message: 'Task deleted successfully' };
  }

  async update(taskid: number, updateTaskDto: TaskDto, userId: number) {
    if (!updateTaskDto.title) {
      throw new BadRequestException('Title is required');
    }

    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskid,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskid} not found`);
    }
    if (task.creatorId !== userId && task.assignedId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this task',
      );
    }

    await this.prismaService.task.update({
      where: {
        id: taskid,
      },
      data: { ...updateTaskDto },
    });

    return { message: 'Task updated successfully' };
  }

  async findOne(id: number) {
    return await this.prismaService.task.findUnique({
      where: {
        id: id,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        group: true,
        assigned: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }
}