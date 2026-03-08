import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsArray,
} from "class-validator";
import {
  EnumCitizenship,
  EnumGender,
  EnumSkills,
} from "src/shared/constants/user.enum.role";

export class CreateRezyumeDto {
  @ApiProperty({ example: "Ali" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Valiyev" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "+998901234567" })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ example: "1995-05-20" })
  @IsDateString()
  @IsNotEmpty()
  birth_year: Date;

  @ApiProperty({ enum: EnumGender })
  @IsEnum(EnumGender)
  @IsNotEmpty()
  gender: EnumGender;

  @ApiProperty({ enum: EnumCitizenship })
  @IsEnum(EnumCitizenship)
  @IsNotEmpty()
  citizenship: EnumCitizenship;

  @ApiProperty({ example: "Toshkent" })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: "2 years of experience in Backend" })
  @IsString()
  @IsNotEmpty()
  experience: string;

  @ApiProperty({ example: "I am a passionate developer...", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: EnumSkills, isArray: true })
  @IsArray()
  @IsEnum(EnumSkills, { each: true })
  @IsOptional()
  skills?: EnumSkills[];
}
