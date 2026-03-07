import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from "src/database/base.entity";
import { Work } from 'src/module/work/entities/work.entity';

@Entity({ name: "categories" })
export class Category extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Work, (work) => work.category)
    works: Work[];
}
