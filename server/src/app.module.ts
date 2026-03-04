import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { ProfileModule } from './module/profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm'
import { Auth } from './module/auth/entities/auth.entity';
import { Profile } from './module/profile/entities/profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: String(process.env.DB_PASSWORD),
      database: String(process.env.DB_NAME),
      synchronize: true,
      logging: false,
      entities: [Auth, Profile]
    }),
    AuthModule, 
    ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
