import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthLoginDto } from '@/auth/dto/auth-login.dto';
import { AuthService } from '@/auth/services/auth.service';
import { clearCookie, setCookie } from '@/common/cookie.util';
import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';
import type { ICustomRequest } from '@/common/interfaces/custom-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register',
    description: 'Register user and put pair of tokens to cookie',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: 'Successfully registered',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() dto: AuthRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);
    setCookie({ accessToken, refreshToken, res });
    return 'Successfully registered';
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Login user and put pair of tokens to cookie',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    example: 'Successfully logged in',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    setCookie({ accessToken, refreshToken, res });

    return 'Successfully logged in';
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Remove tokens from cookie',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    example: 'Successfully logged out',
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Req() req: ICustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken: sessionId } = req.cookies;
    if (!sessionId) throw new UnauthorizedException();
    clearCookie(res);
    return 'Successfully logged out';
  }
}
