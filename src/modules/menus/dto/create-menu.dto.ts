import { IsNotEmpty, IsString } from "class-validator";

export class CreateMenuDto {
    @IsString()
    @IsNotEmpty({message:'khong de trong'})
    title:string
}
