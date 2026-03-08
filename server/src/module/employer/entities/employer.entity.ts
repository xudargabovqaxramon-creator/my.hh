import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from "src/database/base.entity";
import { EnumCitizenship } from "src/shared/constants/user.enum.role";
import { Auth } from "src/module/auth/entities/auth.entity"; // Auth/User entity yo'li
import { Work } from "src/module/work/entities/work.entity"; // Work entity
import { OneToMany } from 'typeorm';

@Entity({ name: "employers" })
export class Employer extends BaseEntity {
    @Column()
    companyName: string;

    @Column({ nullable: true })
    website: string;

    @Column({ type: 'enum', enum: EnumCitizenship })
    country: EnumCitizenship;

    @Column()
    region: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: false })
    isVerified: boolean;

    
    @OneToOne(() => Auth, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' }) // Bazada userId ustunini yaratadi
    user: Auth;

    @Column()
    userId: number;

    @OneToMany(() => Work, (work) => work.employer)
    works: Work[];
}
