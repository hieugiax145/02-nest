import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/utils/helpers/utils';
import { CreateAuthDto, VerifyAuthDto } from 'src/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  async isEmailExisted(email: string) {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;

    const check = await this.isEmailExisted(email);
    if (check) {
      throw new BadRequestException(`${email} đã tồn tại`);
    }

    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });
    return {
      _id: user._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find()).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const result = await this.userModel
      .find()
      .limit(pageSize)
      .skip(skip)
      .select('-password');

    return {
      result,
      totalItems,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return await this.userModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('id không đúng định dạng');
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;

    const check = await this.isEmailExisted(email);
    if (check) {
      throw new BadRequestException(`${email} đã tồn tại`);
    }

    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(1, 'minutes'),
    });

    this.mailerService
      .sendMail({
        to: 'vgclone@gmail.com',
        subject: 'Activation your account', // Subject line
        text: 'welcome', // plaintext body
        template: 'register',
        context: {
          name: user.name ?? user.email,
          activationCode: codeId,
        },
      })
      .then(() => {})
      .catch(() => {});

    return {
      _id: user._id,
    };
  }

  async handleVerify(data: VerifyAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.codeId,
    });
    if (!user) {
      throw new BadRequestException(
        `Không tồn tại người dùng hoặc mã code đã hết hạn`,
      );
    }

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      await this.userModel.updateOne({ _id: data._id }, { isActive: true });
    } else {
      throw new BadRequestException(`Mã code đã hết hạn`);
    }
    return {
      isBeforeCheck,
    };
  }
}
