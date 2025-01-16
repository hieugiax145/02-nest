import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, VerifyAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @ResponseMessage('Success')
  @Post('login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user.id
  }

  @Post('register')
  @Public()
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.handleRegister(createAuthDto);
  }

  @Post('verify')
  @Public()
  verify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.handleVerify(verifyAuthDto);
  }

  @Get('getid')
  @Public()
  currentUser(@Request() req) {
    return req.user.email;
  }

  @Get('mail')
  @Public()
  getMail() {
    this.mailerService
      .sendMail({
        to: 'vgclone@gmail.com',
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'register',
        context: {
          name: 'Ẻic',
          activationCode: 1223,
        },
      })
      .then(() => {})
      .catch(() => {});
  }
}
