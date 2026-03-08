import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employer } from '../entities/employer.entity'; // Yo'lni tekshiring
import { Repository } from 'typeorm';

@Injectable()
export class EmployerOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Employer) 
    private readonly employerRepository: Repository<Employer>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // AuthGuard'dan kelgan user
    const employerId = +request.params.id;

    if (!user) {
      throw new UnauthorizedException("Foydalanuvchi aniqlanmadi");
    }

    // 1. Ish beruvchi profilini bazadan qidiramiz
    const employer = await this.employerRepository.findOne({
      where: { id: employerId },
    });

    // 2. Agar profil topilmasa
    if (!employer) {
      throw new NotFoundException("Ish beruvchi profili topilmadi");
    }

    // 3. Egalikni tekshirish 
    // Diqqat: Entity-da userId yoki authorId degan maydon bo'lishi kerak
    const isOwner = employer.userId === user.id; 
    const isAdmin = user.role === 'admin' || user.role === 'superadmin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Siz faqat o'zingizga tegishli profilni tahrirlashingiz mumkin");
    }

    return true;
  }
}
