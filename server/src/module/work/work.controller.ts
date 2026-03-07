import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Req, Query, ParseIntPipe 
} from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { FilterWorkDto } from './dto/filter-work.dto';
import { 
  ApiBearerAuth, ApiTags, ApiOperation, 
  ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, 
  ApiInternalServerErrorResponse 
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/shared/constants/user.enum.role';
import { WorkOwnerGuard } from './guards/work-owner.guard';

@ApiTags("Work (Vakansiyalar)")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @ApiOperation({ summary: "Barcha vakansiyalarni ko'rish {Public}" })
  @ApiOkResponse({ description: "Vakansiyalar ro'yxati va pagination" })
  @Get()
  findAll(@Query() query: FilterWorkDto) {
    return this.workService.findAll(query);
  }

  @ApiOperation({ summary: "Bitta vakansiyani olish {Public}" })
  @ApiNotFoundResponse({ description: "Vakansiya topilmadi" })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workService.findOne(id);
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER) // Faqat ish beruvchi va admin
  @ApiOperation({ summary: "Yangi vakansiya yaratish {Employer}" })
  @ApiCreatedResponse({ description: "Vakansiya yaratildi" })
  @Post()
  create(@Body() createWorkDto: CreateWorkDto, @Req() req: any) {
    // Agar employerId requesdan kelishi shart bo'lsa:
    return this.workService.create(createWorkDto);
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening vakansiyalarim ro'yxati {Employer}" })
  @Get('my-works')
  findAllMyWorks(@Req() req: any) {
    // req.user.id bu yerda Employer ID deb faraz qilinadi
    return this.workService.findAllByEmployer(req.user.id);
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, RolesGuard, WorkOwnerGuard) // Faqat egasi tahrirlaydi
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: "Vakansiyani tahrirlash {Owner}" })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateWorkDto: UpdateWorkDto
  ) {
    return this.workService.update(id, updateWorkDto);
  }

  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, RolesGuard, WorkOwnerGuard) // Faqat egasi o'chiradi
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: "Vakansiyani o'chirish {Owner/Admin}" })
  @ApiOkResponse({ description: "Vakansiya o'chirildi" })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workService.remove(id);
  }
}
