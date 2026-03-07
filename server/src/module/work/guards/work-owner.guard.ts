import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Work } from '../entities/work.entity'; // Work entity yo'li
import { Repository } from 'typeorm';

@Injectable()
export class WorkOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Work) 
    private readonly workRepository: Repository<Work>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // AuthGuard'dan kelgan user ob'ekti
    const workId = +request.params.id;

    if (!user) {
      throw new UnauthorizedException("Foydalanuvchi aniqlanmadi");
    }

    // 1. Vakansiyani bazadan qidiramiz
    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['employer'], // Employer (ega) bilan bog'lanish
    });

    // 2. Agar vakansiya topilmasa
    if (!work) {
      throw new NotFoundException("Vakansiya topilmadi");
    }

    // 3. Egalikni tekshirish (Adminlar guard'dan o'tib ketaverishi uchun shart qo'shish mumkin)
    const isOwner = work.employerId === user.id;
    const isAdmin = user.role === 'admin' || user.role === 'superadmin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Siz faqat o'zingizga tegishli vakansiyani tahrirlashingiz mumkin");
    }

    return true;
  }
}
