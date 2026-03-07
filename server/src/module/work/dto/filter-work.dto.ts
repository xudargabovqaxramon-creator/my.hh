import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterWorkDto {
    @IsOptional()
    @IsString()
    search?: string; 

    @IsOptional()
    @IsString()
    experience?: string; 

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @Type(() => Number) 
    @IsNumber()
    categoryId?: number;
}
