import { IsNotEmpty } from "class-validator";

export class TaskDto {
    @IsNotEmpty()
    readonly title: string;
    readonly description:  string | null;
    readonly dueDate: Date | null;
    readonly priority: string | null;  
    readonly groupId: number | null;
    readonly assignedId: number | null;
}