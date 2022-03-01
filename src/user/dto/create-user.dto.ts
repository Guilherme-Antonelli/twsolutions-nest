import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateUserDto {
    @IsUUID()
    @IsOptional()
    id?: string;
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsString()
    @IsNotEmpty()
    cpf: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;
    @IsOptional()
    created?: Date;
    @IsOptional()
    updated?: Date;
    @IsOptional()
    deletedAt?: Date;
}
