import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateAuthDto, LoginAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from "./entities/auth.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";
import { VerifyAuthDto } from "./dto/verify-auth.dto";

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    // ------ nodemailer 
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "xudargabovqaxramon@gmail.com",
        pass: process.env.APP_KY,
      },
    });
  }
  
  
  /// google login
  async googleLogin(userData: any) {
    const user = await this.userService.findOrCreate(userData);

    const payload = { email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
      message: "Success",
    };
  }

   
  
  async verify(
    verifyAuthDto: VerifyAuthDto,
  ): Promise<{ access_token: string }> {
    try {
      const { email, otp } = verifyAuthDto;

      const foundeduser = await this.authRepository.findOne({
        where: { email },
      });

      if (!foundeduser) throw new NotFoundException("User Not found");

      const otpValidation = /^\d{6}$/.test(otp);
      if (!otpValidation) throw new BadRequestException("Wrong otp Validation");
      const time = Date.now();
      if (time > foundeduser.otpTime)
        throw new BadRequestException("Otp expired");

      if (otp !== foundeduser.otp) throw new BadRequestException("Wrong otp");

      await this.authRepository.update(foundeduser.id,{otp:"", otpTime: 0})

      const payload = {id: foundeduser.id,  email: foundeduser.email, role: foundeduser.role };

      const access_token = await this.jwtService.signAsync(payload);
      return {
        access_token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }



  async register(createAuthDto: CreateAuthDto) {
    const { email, password, username } = createAuthDto;

    const foundeduser = await this.authRepository.findOne({
      where: { email }
    });

    if (foundeduser) {
      throw new BadRequestException("Email already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const code = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");

    await this.transporter.sendMail({
      from: "xudargabovqaxramon@gmail.com",
      to: email,
      subject: "Otp",
      text: "Simple",
      html: `<b>${code}</b>`,
    });

    const time = Date.now() + 120000;

    const user = this.authRepository.create({
      username,
      email,
      password: hashPassword,
      otp: code,
      otpTime: time,
    });
    await this.authRepository.save(user);

    return {message: "User registered successfully, token olish uchun verify qismiga o'ting"}
  }

async login(loginauthdto: LoginAuthDto): Promise<{ message: string }> {
  try {
    const { email, password } = loginauthdto;
    const foundeduser = await this.authRepository.findOne({ where: { email } });

    if (!foundeduser) throw new NotFoundException("User Not found");

    const isMatch = await bcrypt.compare(password, foundeduser.password);
    if (!isMatch) throw new BadRequestException("Wrong password"); // Exception tashlash afzal

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const time = Date.now() + 120000;

    await this.transporter.sendMail({
      from: '"My Job Portal" <xudargabovqaxramon@gmail.com>',
      to: email,
      subject: "Login OTP Verification",
      html: `Sizning kirish kodingiz: <b>${code}</b>`,
    });

    await this.authRepository.update(foundeduser.id, { otp: code, otpTime: time });

    return { message: "Otp sent. please check your email" };
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
    throw new InternalServerErrorException("Login jarayonida xatolik yuz berdi");
  }
}


  // findOneUser(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

    async  remove(id: number): Promise<boolean> {
      await this.authRepository.delete(id)
      return true
    }
}
