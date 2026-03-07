import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";


export class CreateCategoryDto {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;
}
