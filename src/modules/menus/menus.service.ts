import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Menu } from './schemas/menu.schema';
import { Model } from 'mongoose';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name)
    private menuModel: Model<Menu>,
  ) {}

  async create(userId: string, createMenuDto: CreateMenuDto) {
    const menu = await this.menuModel.create({
      restaurant: userId,
      title: createMenuDto.title,
    });
    return menu;
  }

  async findAll(userId: string) {
    const result=await this.menuModel.find({restaurant:userId});
    return{
      result
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
