import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({})
    @IsEmail()
    email:string;
    @IsNotEmpty()
    password:string;

    @IsOptional()
    name:string
}

export class VerifyAuthDto {
    @IsNotEmpty({message:'_id không được để trống'})
    _id:string;
    @IsNotEmpty({message:'codeId không được để trống'})
    codeId:string;
}
