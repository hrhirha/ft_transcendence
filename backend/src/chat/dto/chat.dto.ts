import { ArrayMinSize, IsArray, IsBoolean, IsDefined, isNotEmpty, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class NewRoomDto
{
    /* {
        name: string,
        password?: string
        uids: ["uid1", "uid2", "uid3" , ...]
    }
    */
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Matches(/^([\w]+ ?(\-?[\w]+)*\.?)+$/)
    name: string;

    @IsBoolean()
    @IsOptional()
    is_private? : boolean;

    @IsString()
    @IsOptional()
    @Matches(/\w+/)
    @Matches(/[A-Z]+/)
    @Matches(/\d+/)
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/)
    password?: string;

    @IsDefined()
    @IsArray()
    @ArrayMinSize(1)
    @IsNotEmpty({each:true})
    @IsString({each:true})
    @Matches(/^c[a-z0-9]{20,}$/, {each: true})
    uids: string[]
}

export class OldRoomDto
{
    @IsNotEmpty()
    @IsString()
    @Matches(/^c[a-z0-9]{20,}$/)
    id: string;

    @IsString()
    @IsOptional()
    @Matches(/\w+/)
    @Matches(/[A-Z]+/)
    @Matches(/\d+/)
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/)
    password?: string;
}

export class SetPasswordDto
{
    @IsNotEmpty()
    @IsString()
    @Matches(/^c[a-z0-9]{20,}$/)
    id: string;

    @IsString()
    @IsOptional()
    @Matches(/\w+/)
    @Matches(/[A-Z]+/)
    @Matches(/\d+/)
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/)
    new_password: string;
}

export class ChangePasswordDto
{
    @IsNotEmpty()
    @IsString()
    @Matches(/^c[a-z0-9]{20,}$/)
    id: string;

    @IsString()
    @IsOptional()
    @Matches(/\w+/)
    @Matches(/[A-Z]+/)
    @Matches(/\d+/)
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/)
    new_password: string;

    @IsString()
    @IsOptional()
    @Matches(/\w+/)
    @Matches(/[A-Z]+/)
    @Matches(/\d+/)
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/)
    old_password: string;
}

export class RemovePasswordDto
{
    @IsNotEmpty()
    @IsString()
    @Matches(/^c[a-z0-9]{20,}$/)
    id: string;

    @IsString()
    @IsOptional()
    @Matches(/\w+/)
    @Matches(/[A-Z]+/)
    @Matches(/\d+/)
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/)
    old_password: string;
}

export class AddMessageDto
{
    @IsString()
    @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/)
    rid: string;

    @IsString()
    @IsNotEmpty()
    msg: string;
}

export class DeleteMessageDto
{
    @IsString()
    @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/)
    id: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/)
    rid: string;
}

export class UserRoomDto
{
    @IsString()
    @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/)
    uid: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/)
    rid: string;
}

export class MuteUserDto
{
    @IsString()
    @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/)
    uid: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/)
    rid: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Matches('^15M$|^1H$|^3H$|^8H$|^24H$|^inf$')
    mute_period: string; // 15M, 1H, 3H, 8H, 24H, inf
}
