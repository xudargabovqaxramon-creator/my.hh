import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRezyumeDto } from './dto/create-rezyume.dto';
import { UpdateRezyumeDto } from './dto/update-rezyume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rezyume } from './entities/rezyume.entity';
import { Repository } from 'typeorm';
import { CountryRegions } from 'src/shared/constants/user.enum.role'; // Mapping ob'ekti turgan joy
import { FilterRezyumeDto } from './dto/filter.rezyume.dto';

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

  async findAll(query: FilterRezyumeDto) {
  try {
    const { page = 1, limit = 10, skill, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.rezyumeRepo.createQueryBuilder("rezyume");

    // 1. Ko'nikmalar bo'yicha qidirish
    if (skill) {
      queryBuilder.andWhere("rezyume.skills ILIKE :skill", { skill: `%${skill}%` });
    }

    // 2. Ism, familiya yoki tavsif bo'yicha umumiy qidiruv
    if (search) {
      queryBuilder.andWhere(
        "(rezyume.firstName ILIKE :search OR rezyume.lastName ILIKE :search OR rezyume.description ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    const total = await queryBuilder.getCount();
    const result = await queryBuilder
      .orderBy("rezyume.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    return {
      next: total > page * limit ? { page: page + 1, limit } : null,
      prev: page > 1 ? { page: page - 1, limit } : null,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      result,
    };
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
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
