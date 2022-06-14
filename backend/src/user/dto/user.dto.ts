import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsEmail()
    fullName: string; 

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

export class UserIdDto
{
    @IsDefined()
    @IsString()
    // @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/)
    id: string;
}

export class EditUsernameDto {
    @IsDefined()
    @IsString()
    @Matches(/^[\w-]{4,20}$/g)
    username: string;
}

export class EditFullNameDto {
    @IsDefined()
    @IsString()
    @Matches(/^([a-zA-Z]+-?[a-zA-Z]+)( ([a-zA-Z]+(\-[a-zA-Z]+)*\.?))+$/)
    fullName: string;
}
