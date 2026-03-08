import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleRedirect(@Request() req: any) {
    return this.authService.googleLogin(req.user)
  }

  @ApiBody({type: CreateAuthDto})
  @HttpCode(200)
  @Post("register")
  create(@Body() createAuthDto: CreateAuthDto) {

    return this.authService.register(createAuthDto);
  }

  @ApiBody({type:VerifyAuthDto})
  @HttpCode(200)
  @Post("verify")
  verify(@Body() verifyAuthDto: VerifyAuthDto) {

    return this.authService.verify(verifyAuthDto);
  }

  @HttpCode(200)
  @Post("login")
  login(@Body() loginAuthDto: LoginAuthDto, ) {

    return this.authService.login(loginAuthDto);
  }


  // @Get()
  // findAll() {
  //   return this.authService.findAllUsers();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOneUser(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  @Delete('delete:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
