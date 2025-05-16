import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskGroupDto } from './dto/TaskGroup.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskgroupService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return await this.prismaService.taskGroup.findMany({
      include: {
        user: {
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

  async create(createTaskGroupDto: TaskGroupDto, userId: number) {
    const { label, description, color  } = createTaskGroupDto;
    
        if (!label) {
          throw new NotFoundException('title is required');
        }
    
        await this.prismaService.taskGroup.create({
          data: {
            label: label,
            description: description || null,
            color: color || null,
            userId: userId,
          },
        });
    
        return { message: "Task's group created successfully" };
  }

  async delete(taskGroupId: number, userId: any) {
    const taskGroup = await this.prismaService.taskGroup.findUnique({
          where: {
            id: taskGroupId,
          },
        });
    
        if (!taskGroup) {
          throw new NotFoundException("Task's group not found");
        }
    
        if (taskGroup.userId !== userId) {
          throw new ForbiddenException(
            "You are not authorized to delete this task's group"
          );
        }
        await this.prismaService.taskGroup.delete({
          where: {
            id: taskGroupId,
          },
        });
        return { message: "Task's group deleted successfully" };
  }

  async update(taskGroupId: number, updateTaskGroupDto: TaskGroupDto, userId: any) {
    if (!updateTaskGroupDto.label) {
          throw new BadRequestException('label is required');
        }
    
        const taskGroup = await this.prismaService.taskGroup.findUnique({
          where: {
            id: taskGroupId,
          },
        });
    
        if (!taskGroup) {
          throw new NotFoundException(`Task's group with ID ${taskGroupId} not found`);
        }
        if (taskGroup.userId !== userId ) {
          throw new ForbiddenException(
            "You are not authorized to update this task's group"
          );
        }
    
        await this.prismaService.taskGroup.update({
          where: {
            id: taskGroupId,
          },
          data: { ...updateTaskGroupDto },
        });
    
        return { message: "Task's group updated successfully" };
    }

    async findOne(id: number) {
    return await this.prismaService.taskGroup.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        tasks:{
            select: {
                id: true,
                title: true,
            }
        },
      },
    });
  }
  
}
