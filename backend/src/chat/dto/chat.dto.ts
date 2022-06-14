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
    /* {
        id: string,
        password?: string
        }
    */

    @IsString()
    @IsNotEmpty()
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

export class AddMessageDto
{
    // { rid: string, msg: string }

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
    // { id: string, rid: string}

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
    // { uid: string, rid: string }

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
