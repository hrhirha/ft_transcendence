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
    @Matches(/^([\w]+ ?(\-?[\w]+)*\.?)+$/, { message: "channel name can only contain a-z A-Z 0-9 - . SP" })
    name: string;

    @IsBoolean()
    @IsOptional()
    is_private? : boolean;

    @IsString()
    @IsOptional()
    @Matches(/\w{5,}/, { message: "password should be at least 8 characters long" })
    @Matches(/[A-Z]+/, { message: "password should contain at least one UPPERCASE" })
    @Matches(/\d+/, { message: "password should contain at least one number" })
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/, { message: "password should contain at least one special character !@#$&*?-=+" })
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
    @Matches(/\w{5,}/, { message: "password should be at least 8 characters long" })
    @Matches(/[A-Z]+/, { message: "password should contain at least one UPPERCASE" })
    @Matches(/\d+/, { message: "password should contain at least one number" })
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/, { message: "password should contain at least one special character !@#$&*?-=+" })
    password?: string;
}

export class EditRoomDto
{
    @IsNotEmpty()
    @IsString()
    @Matches(/^c[a-z0-9]{20,}$/)
    rid: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Matches(/^([\w]+ ?(\-?[\w]+)*\.?)+$/, { message: "channel name can only contain a-z A-Z 0-9 - . SP" })
    name: string;

    @IsDefined()
    @IsArray()
    @IsNotEmpty({each:true})
    @IsString({each:true})
    @Matches(/^c[a-z0-9]{20,}$/, {each: true})
    uids: string[]
}

export class SetPasswordDto
{
    @IsNotEmpty()
    @IsString()
    @Matches(/^c[a-z0-9]{20,}$/)
    id: string;

    @IsString()
    @IsOptional()
    @Matches(/\w{5,}/, { message: "password should be at least 8 characters long" })
    @Matches(/[A-Z]+/, { message: "password should contain at least one UPPERCASE" })
    @Matches(/\d+/, { message: "password should contain at least one number" })
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/, { message: "password should contain at least one special character !@#$&*?-=+" })
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
    @Matches(/\w{5,}/, { message: "password should be at least 8 characters long" })
    @Matches(/[A-Z]+/, { message: "password should contain at least one UPPERCASE" })
    @Matches(/\d+/, { message: "password should contain at least one number" })
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/, { message: "password should contain at least one special character !@#$&*?-=+" })
    new_password: string;

    @IsString()
    @IsOptional()
    @Matches(/\w{5,}/, { message: "password should be at least 8 characters long" })
    @Matches(/[A-Z]+/, { message: "password should contain at least one UPPERCASE" })
    @Matches(/\d+/, { message: "password should contain at least one number" })
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/, { message: "password should contain at least one special character !@#$&*?-=+" })
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
    @Matches(/\w{5,}/, { message: "password should be at least 8 characters long" })
    @Matches(/[A-Z]+/, { message: "password should contain at least one UPPERCASE" })
    @Matches(/\d+/, { message: "password should contain at least one number" })
    @Matches(/[\!\@\#\$\&\*\?\-\=\+]+/, { message: "password should contain at least one special character !@#$&*?-=+" })
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
    @Matches(/^15M$|^1H$|^3H$|^8H$|^24H$|^inf$/, { message: "allowed values: 15M,1H,3H,8H,24H,inf" })
    mute_period: string; // 15M, 1H, 3H, 8H, 24H, inf
}

export class UserIdDto
{
    @IsString()
    @IsNotEmpty()
    @Matches(/^c[a-z0-9]{20,}$/)
    id: string;
}
