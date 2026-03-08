import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from "src/database/base.entity";
import { Employer } from 'src/module/employer/entities/employer.entity';
import { Category } from 'src/module/categories/entities/category.entity';

@Entity({ name: "works" })
export class Work extends BaseEntity {
    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    salary: string; 

    @Column()
    experience: string;

    @Column({ default: 'active' })
    status: string; 

    @DeleteDateColumn()
    deletedAt: Date;
  
   
@ManyToOne(() => Employer, (employer) => employer.works, { onDelete: 'CASCADE' })   
employer: Employer;

    @Column()
    employerId: number;
    
    @ManyToOne(() => Category, (category) => category.works)
    category: Category;

    @Column()
    categoryId: number;

}
