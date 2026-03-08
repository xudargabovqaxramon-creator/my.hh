import { IsEnum } from "class-validator";
import { BaseEntity } from "src/database/base.entity";
import { Auth } from "src/module/auth/entities/auth.entity";
import {
  EnumCitizenship,
  EnumGender,
  EnumSkills,
} from "src/shared/constants/user.enum.role";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
@Entity({ name: "rezyume" })
export class Rezyume extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone_number: string;

  @Column()
  birth_year: Date;

  @Column({ type: "enum", enum: EnumGender })
  gender: EnumGender;

  @Column({ type: "enum", enum: EnumCitizenship })
  citizenship: EnumCitizenship;

  @Column()
  region: string;

  @Column()
  experience: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: EnumSkills,
    array: true,
    default: [],
    nullable: true,
  })
  skills: EnumSkills[];

  //relations
  @OneToOne(() => Auth, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Auth;

  @Column()
  userId: number;
}
