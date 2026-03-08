import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { EmployerService } from "./employer.service";
import { CreateEmployerDto } from "./dto/create-employer.dto";
import { UpdateEmployerDto } from "./dto/update-employer.dto";
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiInternalServerErrorResponse 
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RolesGuard } from "src/common/guard/role.guard";
import { Roles } from "src/common/decorators/role.decorator";
import { UserRole } from "src/shared/constants/user.enum.role";
import { EmployerOwnerGuard } from "./guard/employer-owner.guard";

@ApiTags("Ish beruvchi (Employer)")
@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Serverda ichki xatolik" })
@Controller("employer")
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) 
  @ApiOperation({ summary: "Yangi ish beruvchi profilini yaratish {Admin Only}" })
  @ApiResponse({ status: 201, description: "Ish beruvchi muvaffaqiyatli yaratildi." })
  create(@Body() dto: CreateEmployerDto) {
    return this.employerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha ish beruvchilar ro'yxatini ko'rish" })
  @ApiResponse({ status: 200, description: "Ro'yxat qaytarildi." })
  findAll() {
    return this.employerService.findAll();
  }

   @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard, EmployerOwnerGuard) 
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN) 
  @ApiOperation({ summary: "Ish beruvchi ma'lumotlarini tahrirlash {Owner/Admin}" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmployerDto,
  ) {
    return this.employerService.update(id, updateDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard, EmployerOwnerGuard)
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: "Ish beruvchi profilini o'chirish {Owner/Admin}" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.employerService.remove(id);
  }

}
