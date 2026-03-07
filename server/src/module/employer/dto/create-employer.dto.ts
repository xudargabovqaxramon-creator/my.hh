import { IsEnum, IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumCitizenship } from 'src/shared/constants/user.enum.role';

export class CreateEmployerDto {
    @ApiProperty({ example: 'SoftTech LLC' })
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @ApiProperty({ example: 'https://softtech.uz', required: false })
    @IsUrl()
    @IsOptional()
    website?: string;

    @ApiProperty({ enum: EnumCitizenship })
    @IsEnum(EnumCitizenship)
    @IsNotEmpty()
    country: EnumCitizenship;

    @ApiProperty({ example: 'Toshkent' })
    @IsString()
    @IsNotEmpty()
    region: string;

    @ApiProperty({ example: "Kompaniya haqida ma'lumot...", required: false })
    @IsString()
    @IsOptional()
    description?: string;
}
