import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, NotContains } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    displayName?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    profileUrl?: string;

    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @IsNumber()
    @IsOptional()
    score?: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsNumber()
    @IsOptional()
    wins?: number;

    @IsNumber()
    @IsOptional()
    loses?: number;
}

export class EditUserDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @NotContains(' ')
    // @Matches(/[a-zA-Z0-9_]/)
    username?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @NotContains(' ')
    imageUrl?: string;
}
