import { IsNotEmpty } from 'class-validator';

export class TaskGroupDto {
  @IsNotEmpty()
  readonly label: string;
  readonly description: string | null;
  readonly color: string | null;
}
