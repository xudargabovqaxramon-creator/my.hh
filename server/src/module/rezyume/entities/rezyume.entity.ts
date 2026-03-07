import { IsEnum } from "class-validator";
import { BaseEntity } from "src/database/base.entity";
import { EnumCitizenship, EnumGender } from "src/shared/constants/user.enum.role";
import { Column, Entity } from "typeorm";

@Entity({name: "rezyume"})
export class Rezyume  extends BaseEntity{

    @Column({})
    phone_number: string;

    @Column()
    birth_year: Date;

    @Column({type: "enum" , enum: EnumGender})
    gender : EnumGender

    @Column({ type: 'enum', enum: EnumCitizenship })
    citizenship :EnumCitizenship

    @Column()
    region : string
}
