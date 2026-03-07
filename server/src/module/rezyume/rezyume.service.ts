import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRezyumeDto } from './dto/create-rezyume.dto';
import { UpdateRezyumeDto } from './dto/update-rezyume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rezyume } from './entities/rezyume.entity';
import { Repository } from 'typeorm';
import { CountryRegions } from 'src/shared/constants/user.enum.role'; // Mapping ob'ekti turgan joy

@Injectable()
export class RezyumeService {
  constructor(
    @InjectRepository(Rezyume) 
    private readonly rezyumeRepo: Repository<Rezyume>
  ) {}

  async createRezyume(dto: CreateRezyumeDto) {
    const { citizenship, region } = dto;

   
    const validRegions = CountryRegions[citizenship];
    
    if (!validRegions || !validRegions.includes(region)) {
      throw new BadRequestException(
        `${citizenship} davlati uchun '${region}' nomi noto'g'ri yoki ro'yxatda yo'q!`
      );
    }

    
    const newRezyume = this.rezyumeRepo.create(dto);
    return await this.rezyumeRepo.save(newRezyume);
  }

  async findAll() {
    return await this.rezyumeRepo.find();
  }

  async findOne(id: number) {
    const rezyume = await this.rezyumeRepo.findOne({ where: { id } as any });
    if (!rezyume) throw new NotFoundException(`Rezyume #${id} not found`);
    return rezyume;
  }

  async update(id: number, updateRezyumeDto: UpdateRezyumeDto) {
    const rezyume = await this.findOne(id);

    if (updateRezyumeDto.citizenship || updateRezyumeDto.region) {
      const country = updateRezyumeDto.citizenship || rezyume.citizenship;
      const region = updateRezyumeDto.region || rezyume.region;
      
      const validRegions = CountryRegions[country];
      if (!validRegions.includes(region)) {
        throw new BadRequestException("Region davlatga mos emas");
      }
    }

    Object.assign(rezyume, updateRezyumeDto);
    return await this.rezyumeRepo.save(rezyume);
  }

  async remove(id: number) {
    const rezyume = await this.findOne(id);
    await this.rezyumeRepo.remove(rezyume);
    return { message: "Rezyume deleted" };
  }
}
