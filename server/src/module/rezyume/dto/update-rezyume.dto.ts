import { PartialType } from '@nestjs/swagger';
import { CreateRezyumeDto } from './create-rezyume.dto';

export class UpdateRezyumeDto extends PartialType(CreateRezyumeDto) {}
