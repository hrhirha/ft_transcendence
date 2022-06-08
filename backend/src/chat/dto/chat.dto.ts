import { IsArray, IsDefined, isNotEmpty, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class NewRoomDto
{
    /* {
        name: string,
        type: string,
        password?: string }
    */
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsDefined()
    @IsArray()
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
    id: string;

    @IsString()
    @IsOptional()
    password?: string;
}

export class AddMessageDto
{
    // { uid: string, rid: string, msg: string }

    // @IsString()
    // @IsNotEmpty()
    // uid: string;

    @IsString()
    @IsNotEmpty()
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
    id: string;

    @IsString()
    @IsNotEmpty()
    rid: string;
}

export class UserRoomDto
{
    // { uid: string, rid: string }

    @IsString()
    @IsNotEmpty()
    uid: string;

    @IsString()
    @IsNotEmpty()
    rid: string;
}

export class MuteUserDto
{
    @IsString()
    @IsNotEmpty()
    uid: string;

    @IsString()
    @IsNotEmpty()
    rid: string;

    @IsString()
    @IsNotEmpty()
    @Matches('^15M$|^1H$|^3H$|^8H$|^24H$|^inf$')
    mute_period: string; // 15M, 1H, 3H, 8H, 24H, inf
}
