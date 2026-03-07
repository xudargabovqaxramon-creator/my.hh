import { 
  IsEnum, 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsDateString, 
  IsPhoneNumber 
} from 'class-validator';
import { EnumCitizenship, EnumGender } from 'src/shared/constants/user.enum.role';

export class CreateRezyumeDto {
  @IsNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsDateString() 
  @IsNotEmpty()
  birth_year: Date;

  @IsEnum(EnumGender)
  @IsNotEmpty()
  gender: EnumGender;

  @IsEnum(EnumCitizenship)
  @IsNotEmpty()
  citizenship: EnumCitizenship;

  @IsString()
  @IsNotEmpty()
  region: string;
}
