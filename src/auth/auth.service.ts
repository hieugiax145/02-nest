import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, VerifyAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from 'src/utils/helpers/utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if(!user) return null;
    const isValid = await comparePasswordHelper(pass, user.password);
    if (!isValid) return null;
    return user;
  }

  async login(user: any) {
    const payload = {id: user._id, email: user.email };
    return {
      user:user,
      access_token: this.jwtService.sign(payload),
    };
  }

  // async signIn(email: string, password: string): Promise<any> {
  //   const user = await this.usersService.findByEmail(email);
  //   const isValid = await comparePasswordHelper(password, user.password);
  //   if (!isValid) {
  //     throw new UnauthorizedException();
  //   }
  //   const payload = { sub: user._id, email: user.email };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }

  handleRegister = async (createAuthDto: CreateAuthDto) => this.usersService.handleRegister(createAuthDto);

  handleVerify = async (verifyAuthDto: VerifyAuthDto) => this.usersService.handleVerify(verifyAuthDto);


}
