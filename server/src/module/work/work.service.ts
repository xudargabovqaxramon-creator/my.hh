import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Work } from './entities/work.entity';
import { CreateWorkDto } from './dto/create-work.dto';
import { FilterWorkDto } from './dto/filter-work.dto'; 
import { UpdateWorkDto } from './dto/update-work.dto';
import { Category } from '../categories/entities/category.entity';
import { Employer } from '../employer/entities/employer.entity';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work) private readonly workRepo: Repository<Work>,
    @InjectRepository(Employer) private readonly empRepo :Repository<Employer>,
    @InjectRepository(Category) private readonly CtgRepo :Repository<Category>
  ) {}

  async create(createWorkDto: CreateWorkDto): Promise<Work> {
    try {
       const { categoryId, employerId } = createWorkDto; 

    
    const foundedEmployer = await this.empRepo.findOneBy({ id: employerId });
    const foundedCategory = await this.CtgRepo.findOneBy({ id: categoryId });

    
    if (!foundedEmployer) {
      throw new NotFoundException("Employer Id not found");
    }

    if (!foundedCategory) {
      throw new NotFoundException("Category Id not found");
    }

    const work = this.workRepo.create(createWorkDto);
    return await this.workRepo.save(work);
    } catch (error) { 
      throw new InternalServerErrorException(error.message);
    }
  }

 async findAll(query: FilterWorkDto) {

  const { page = 1, limit = 10, search, experience, categoryId } = query;

  const queryBuilder = this.workRepo.createQueryBuilder("work")
    .leftJoinAndSelect("work.employer", "employer")
    .where("work.isActive = :isActive", { isActive: true })
    .andWhere("work.deletedAt IS NULL");

  if (categoryId) {
    queryBuilder.andWhere("work.categoryId = :catId", { catId: categoryId });
  }

  if (experience) {
    queryBuilder.andWhere("work.experience = :experience", { experience });
  }


      const total = await queryBuilder.getCount();

      const result = await queryBuilder
        .orderBy("work.createdAt", "DESC")
        .skip((page - 1) * limit)
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
  

  async findAllByEmployer(employerId: number): Promise<Work[]> {
    try {
      return await this.workRepo.find({
        where: { employerId },
        relations: ["employer"],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  async findOne(id: number): Promise<Work> {
    try {
      const work = await this.workRepo.findOne({
        where: { id } as any,
        relations: ["employer"]
      });

      if (!work) throw new NotFoundException("Vakansiya topilmadi");

      return work;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
  async update(id: number, updateWorkDto: UpdateWorkDto): Promise<Work> {
    try {
     
      const work = await this.findOne(id);
      const updatedWork = this.workRepo.merge(work, updateWorkDto);

      return await this.workRepo.save(updatedWork);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  //  Soft Delete 
  async remove(id: number): Promise<{ message: string }> {
    try {
      const work = await this.findOne(id); // Borligini tekshiramiz
      await this.workRepo.softDelete(work.id);
      return { message: "Vakansiya muvaffaqiyatli o'chirildi" };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
