import { IsNotEmpty } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty({message:'Số tiền thanh toán không được để trống'})
    amount:number;
}
