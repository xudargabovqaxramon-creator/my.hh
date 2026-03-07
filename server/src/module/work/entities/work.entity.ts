import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from "src/database/base.entity";
import { ApiProperty } from '@nestjs/swagger';
import { Employer } from 'src/module/employer/entities/employer.entity';
import { Category } from 'src/module/categories/entities/category.entity';

@Entity({ name: "works" })
export class Work extends BaseEntity {
    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    salary: string; // Masalan: "1000$ - 1500$"

    @Column()
    experience: string; // Masalan: "1-3 years"

    @Column({ default: 'active' })
    status: string; // active, closed

    @DeleteDateColumn()
    deletedAt: Date;
  
    @Column({default: true})
    isActive: boolean;

    @ManyToOne(() => Employer, (employer) => employer.id, { onDelete: 'CASCADE' })
    employer: Employer;

    @Column()
    employerId: number; // Relation ID

    // work.entity.ts ichida
    @ManyToOne(() => Category, (category) => category.works)
    category: Category;

    @Column()
    categoryId: number;

}
