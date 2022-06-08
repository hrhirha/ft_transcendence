import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, NotContains } from "class-validator";

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

    // @IsString()
    // @IsOptional()
    // firstName?: string;

    // @IsString()
    // @IsOptional()
    // lastName?: string;

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
    id: string;
}

export class EditUsernameDto {
    @IsDefined()
    @IsString()
    @Matches('^[a-zA-Z0-9\_]{4,20}$')
    username: string;
}

export class EditFullNameDto {
    @IsDefined()
    @IsString()
    @Matches('^[a-zA-Z\-]{4,20} [a-zA-Z\-]{4,20}$')
    fullName: string;
}
