import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message:"name khong duoc bo trong"})
    name: string;

    @IsNotEmpty({message:"email khong duoc bo trong"})
    @IsEmail({},{message:"email khong dung dinh dang"})
    email: string;

    @IsNotEmpty({message:"password khong duoc bo trong"})
    password: string;
    phone: string;
    address: string;

    image: string;

}
