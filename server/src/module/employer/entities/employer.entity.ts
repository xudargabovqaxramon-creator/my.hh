import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from "src/database/base.entity";
import { EnumCitizenship } from "src/shared/constants/user.enum.role";
import { ApiProperty } from '@nestjs/swagger';

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
}
