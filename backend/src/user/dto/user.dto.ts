import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export interface UserDto
{
    id?: string;
    username: string;
    fullName: string;
    imageUrl: string;
    score?: number;
    rank?: {
        title: string,
        icon: string,
        field: string,
    };
    wins?: number;
    loses?: number;
    status?: string;
    relation?: string
}

export class UserIdDto
{
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/, {message: "Invalid id format"})
    id: string;
}

export class EditUsernameDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\w-]{4,20}$/m, { message: "username can only contain a-z A-Z 0-9 -" })
    username: string;
}

export class EditFullNameDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    @Matches(/^([a-zA-Z]+-?[a-zA-Z]+)( ([a-zA-Z]+(\-[a-zA-Z]+)*\.?))+$/, { message: "fullName can only contain a-z A-Z - . SP" })
    fullName: string;
}
