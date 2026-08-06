import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CurrentUser, AuthUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return { data: await this.authService.login(dto) };
  }

  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    return { data: await this.authService.me(user.id) };
  }
}
