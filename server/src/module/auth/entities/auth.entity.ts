import { BaseEntity } from "src/database/base.entity";
import { UserRole } from "src/shared/constants/user.enum.role";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "auth" })
export class Auth extends BaseEntity {
  @Column()
  username:string
  
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  otp: string;

  @Column({ type: "bigint" })
  otpTime: number;

  @Column({ default: UserRole.EMPLOYEE })
  role: UserRole;

  //extra info
  @Column({ nullable: true })
  firstname?: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ nullable: true })
  bio?: string;
}
