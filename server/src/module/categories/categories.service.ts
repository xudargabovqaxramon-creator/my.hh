import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const exists = await this.categoryRepo.findOne({ where: { name: createCategoryDto.name } });
      if (exists) throw new ConflictException("Ushbu kategoriya allaqachon mavjud");

      const category = this.categoryRepo.create(createCategoryDto);
      return await this.categoryRepo.save(category);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepo.find({ relations: ['works'] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } as any });
    if (!category) throw new NotFoundException(`Kategoriya #${id} topilmadi`);
    return category;
  }

  // --- UPDATE METODI ---
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      const category = await this.findOne(id);
      
      // Agar nom o'zgartirilsa, unikal ekanligini tekshirish mumkin
      this.categoryRepo.merge(category, updateCategoryDto);
      return await this.categoryRepo.save(category);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    return { message: "Kategoriya o'chirildi" };
  }
}
