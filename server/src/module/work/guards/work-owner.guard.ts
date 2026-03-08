import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Work } from '../entities/work.entity'; 
import { Repository } from 'typeorm';

@Injectable()
export class WorkOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Work) 
    private readonly workRepository: Repository<Work>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 
    const workId = +request.params.id;

    if (!user) {
      throw new UnauthorizedException("Foydalanuvchi aniqlanmadi");
    }

    const work = await this.workRepository.findOne({
      where: { id: workId },
      relations: ['employer'], 
    });

    if (!work) {
      throw new NotFoundException("Vakansiya topilmadi");
    }

    const isOwner = work.employerId === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Siz faqat o'zingizga tegishli vakansiyani tahrirlashingiz mumkin");
    }

    return true;
  }
}
