import { Controller, Post, Get, Body, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateEmployerDto } from './dto/update-employer.dto';

@ApiTags('Employer')
@Controller('employer')
export class EmployerController {
    constructor(private readonly employerService: EmployerService) {}

    @Post()
    @ApiOperation({ summary: "Kompaniya profilini yaratish" })
    create(@Body() dto: CreateEmployerDto) {
        return this.employerService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: "Barcha kompaniyalarni ko'rish" })
    findAll() {
        return this.employerService.findAll();
    }

    
  @Patch(':id')
  @ApiOperation({ summary: "Kompaniya ma'lumotlarini tahrirlash" })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli yangilandi.' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDto: UpdateEmployerDto
  ) {
    return this.employerService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Kompaniya profilini o'chirish" })
  @ApiResponse({ status: 200, description: "O'chirildi." })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employerService.remove(id);
  }
}
