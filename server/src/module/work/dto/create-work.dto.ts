import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkDto {
    @ApiProperty({ example: 'Node.js Backend Developer' })
    @IsString() @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'NestJS va PostgreSQL bilan ishlash tajribasi...' })
    @IsString() @IsNotEmpty()
    description: string;

    @ApiProperty({ example: '1500$' })
    @IsString() @IsNotEmpty()
    salary: string;

    @ApiProperty({ example: '2 years' })
    @IsString() @IsNotEmpty()
    experience: string;

    @ApiProperty({ example: 1 })
    @IsNumber() @IsNotEmpty()
    employerId: number;

    @ApiProperty({example: 1})
    @IsNumber()
    categoryId?: number;
}


export class PaginationDto {
    @IsOptional() @IsNumber() @Min(1)
    page?: number = 1;

    @IsOptional() @IsNumber() @Min(1)
    limit?: number = 10;
}
