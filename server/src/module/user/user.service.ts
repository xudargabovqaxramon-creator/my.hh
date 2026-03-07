import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Auth } from "../auth/entities/auth.entity";

@Injectable()
export class UserService {
    constructor(@InjectRepository(Auth) private userRepo: Repository<Auth>){}

    async findOrCreate(userData: Partial<Auth>): Promise<Auth> {
        const foundedUser = await this.userRepo.findOne({
            where: {email: userData.email}
        })

        if (foundedUser) {
            return foundedUser
        }

        const user = this.userRepo.create({username:userData.firstname, email: userData.email})
        return await this.userRepo.save(user)
    }


    async findByEmail(email: string):Promise<Auth | null>{
        return await this.userRepo.findOne({where:{email}})
    }
}