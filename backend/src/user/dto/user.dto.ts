import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    displayName: string;

    @IsNotEmpty()
    @IsOptional()
    firstName: string;

    @IsNotEmpty()
    @IsOptional()
    lastName: string;

    @IsNotEmpty()
    @IsOptional()
    profileUrl: string;

    @IsNotEmpty()
    @IsString()
    imageUrl: string;
}

export class EditUserDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}
