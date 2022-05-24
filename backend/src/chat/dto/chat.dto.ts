import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class NewChatDto
{
    // { name: string, type: string, password?: string }

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    password?: string;
}

export class OldChatDto
{
    // { id: string, password?: string }

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    password?: string;
}

export class AddMessageDto
{
    // { user_id: string, chat_id: string, msg: string }

    @IsString()
    @IsNotEmpty()
    chat_id: string;

    @IsString()
    @IsNotEmpty()
    msg: string;
}

export class DeleteMessageDto
{
    // { id: string, chat_id: string}

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    chat_id: string;
}

export class UserChatDto
{
    // { user_id: string, chat_id: string }

    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    chat_id: string;
}
