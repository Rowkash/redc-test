import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersService } from '@/users/services/users.service';
import { AuthLoginDto } from '@/auth/dto/auth-login.dto';
import { UserEntity } from '@/users/entities/user.entity';
import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';
import { UserStatusEnum } from '@/users/enums/user-status.enum';
import { IJwtData } from '@/auth/interfaces/auth-service.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: AuthRegisterDto) {
    await this.userService.checkUserEmailExists(dto.email);
    const hashPass = await hash(dto.password);
    const user = await this.userService.create({ ...dto, password: hashPass });
    const { accessToken, refreshToken } = this.generateTokens(user);

    return { accessToken, refreshToken };
  }

  async login(data: AuthLoginDto) {
    const user = await this.validateUser(data);
    const { accessToken, refreshToken } = this.generateTokens(user);

    return { accessToken, refreshToken };
  }

  private generateTokens(user: UserEntity) {
    const jwtData: IJwtData = {
      userId: user.id,
      email: user.email,
      roles: user.roles,
    };

    const secret = this.configService.get('auth.jwtSecret');
    const expiresIn = this.configService.get('auth.jwtExpires');

    const accessToken = this.jwtService.sign(jwtData, {
      secret,
      expiresIn,
    });

    const refreshToken = this.jwtService.sign(jwtData, {
      secret,
      expiresIn,
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthLoginDto) {
    const user = await this.userService.getOne({
      email: dto.email,
      status: UserStatusEnum.ACTIVE,
    });
    if (user) {
      const passEquals = await verify(user.password, dto.password);
      if (passEquals) return user;
    }

    throw new BadRequestException({ message: 'Wrong user name or password' });
  }
}
