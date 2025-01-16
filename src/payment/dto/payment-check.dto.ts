import { IsNotEmpty } from "class-validator";

export class PaymentCheckDto {
    @IsNotEmpty({message:"orderId không được để trống"})
    orderId:string;
}
