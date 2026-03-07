import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtStrategy } from './strategies/jwt-strategy';
import { GoogleStrategy } from './strategies/google-strategy';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([Auth]),
    UserModule,
    JwtModule.register({
      global: true,
      secret:String(process.env.SECRET),
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
