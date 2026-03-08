import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { RezyumeService } from "./rezyume.service";
import { CreateRezyumeDto } from "./dto/create-rezyume.dto";
import { UpdateRezyumeDto } from "./dto/update-rezyume.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { FilterRezyumeDto } from "./dto/filter.rezyume.dto";

@ApiTags("Rezyume")
@Controller("rezyume")
export class RezyumeController {
  constructor(private readonly rezyumeService: RezyumeService) {}

  @Post()
  @ApiOperation({ summary: "Yangi rezyume yaratish" })
  @ApiResponse({
    status: 201,
    description: "Rezyume muvaffaqiyatli yaratildi.",
  })
  @ApiResponse({
    status: 400,
    description: 'Xato ma"lumotlar yoki notogri region.',
  })
  create(@Body() createRezyumeDto: CreateRezyumeDto) {
    return this.rezyumeService.createRezyume(createRezyumeDto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha rezyumelarni ko'rish" })
  @ApiOperation({ summary: "Rezyumelarni skill va ism bo'yicha qidirish" })
  findAll(@Query() query: FilterRezyumeDto) {
    return this.rezyumeService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha bitta rezyumeni olish" })
  @ApiParam({ name: "id", description: "Rezyume ID raqami" })
  @ApiResponse({ status: 200, description: "Rezyume topildi." })
  @ApiResponse({ status: 404, description: "Rezyume topilmadi." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.rezyumeService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Rezyumeni tahrirlash" })
  @ApiResponse({ status: 200, description: "Muvaffaqiyatli yangilandi." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRezyumeDto: UpdateRezyumeDto,
  ) {
    return this.rezyumeService.update(id, updateRezyumeDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Rezyumeni o'chirish" })
  @ApiResponse({
    status: 200,
    description: "O'chirish muvaffaqiyatli yakunlandi.",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.rezyumeService.remove(id);
  }
}
