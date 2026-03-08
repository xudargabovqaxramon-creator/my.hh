import { Module } from "@nestjs/common";
import { WorkService } from "./work.service";
import { WorkController } from "./work.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Work } from "./entities/work.entity";
import { Employer } from "../employer/entities/employer.entity";
import { Category } from "../categories/entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Work, Employer, Category])],
  controllers: [WorkController],
  providers: [WorkService],
})
export class WorkModule {}
