import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employer } from './entities/employer.entity';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { CountryRegions } from 'src/shared/constants/user.enum.role';
import { UpdateEmployerDto } from './dto/update-employer.dto';

@Injectable()
export class EmployerService {
    constructor(
        @InjectRepository(Employer)
        private readonly employerRepo: Repository<Employer>,
    ) {}

    async create(dto: CreateEmployerDto) {
        // Region validatsiyasi
        const validRegions = CountryRegions[dto.country];
        if (!validRegions || !validRegions.includes(dto.region)) {
            throw new BadRequestException("Tanlangan region davlatga mos emas!");
        }

        const employer = this.employerRepo.create(dto);
        return await this.employerRepo.save(employer);
    }

    async findAll() {
        return await this.employerRepo.find();
    }

    async findOne(id: number) {
        const employer = await this.employerRepo.findOne({ where: { id } as any });
        if (!employer) throw new NotFoundException("Kompaniya topilmadi");
        return employer;
    }


    
  async update(id: number, updateDto: UpdateEmployerDto) {
    const employer = await this.findOne(id);

    // Agar davlat yoki region yangilanayotgan bo'lsa, moslikni tekshiramiz
    if (updateDto.country || updateDto.region) {
      const country = updateDto.country || employer.country;
      const region = updateDto.region || employer.region;

      const validRegions = CountryRegions[country];
      if (!validRegions || !validRegions.includes(region)) {
        throw new BadRequestException("Yangilangan region tanlangan davlatga mos emas!");
      }
    }

    Object.assign(employer, updateDto);
    return await this.employerRepo.save(employer);
  }

  async remove(id: number) {
    const employer = await this.findOne(id);
    await this.employerRepo.remove(employer);
    return { message: "Kompaniya muvaffaqiyatli o'chirildi" };
  }

}
