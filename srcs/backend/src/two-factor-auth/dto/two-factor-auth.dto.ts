import { IsDefined, IsString, Matches } from "class-validator";

export class TFADto {
    @IsDefined()
    @IsString()
    @Matches('^[0-9]{6}$')
    code: string;
}