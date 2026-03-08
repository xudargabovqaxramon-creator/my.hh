import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'IT & Dasturlash' })
  @IsString()      
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Texnologiya sohasidagi vakansiyalar', required: false })
  @IsString()    
  @IsOptional()
  description?: string;
}
