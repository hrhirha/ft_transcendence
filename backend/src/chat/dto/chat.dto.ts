import { IsBoolean, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class NewRoomDto
{
    /* {
        name: string,
        is_channel: boolean,
        type: string,
        password?: string }
    */
    @IsString()
    @IsNotEmpty()
    name: string;

    // @IsBoolean()
    // is_channel: boolean;

    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    password?: string;
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
    mute_period: string;
}
