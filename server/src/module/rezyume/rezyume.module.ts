import { Module } from '@nestjs/common';
import { RezyumeService } from './rezyume.service';
import { RezyumeController } from './rezyume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rezyume } from './entities/rezyume.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rezyume])],
  controllers: [RezyumeController],
  providers: [RezyumeService],
})
export class RezyumeModule {}
