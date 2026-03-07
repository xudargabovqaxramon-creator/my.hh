import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm'
import { Auth } from './module/auth/entities/auth.entity';
import { EmployerModule } from './module/employer/employer.module';
import { WorkModule } from './module/work/work.module';
import { RezyumeModule } from './module/rezyume/rezyume.module';
import { CategoriesModule } from './module/categories/categories.module';
import { Rezyume } from './module/rezyume/entities/rezyume.entity';
import { Work } from './module/work/entities/work.entity';
import { Employer } from './module/employer/entities/employer.entity';
import { Category } from './module/categories/entities/category.entity';

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
      entities: [Auth, Work, Rezyume, Employer, Category],  
      extra:{
        max: 20
      }
    }),
    AuthModule,
    EmployerModule,
    CategoriesModule,
    WorkModule,
    RezyumeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
