import { IsEmail } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string
  password: string
  firstName: string;
  lastName: string;
  hobby?: string;
  into?: string;
  description?: string;
  role?: string;
  photo?: string
}