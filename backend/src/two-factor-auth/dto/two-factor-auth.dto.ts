import { IsString } from "class-validator";

export class TFADto {
    @IsString()
    secret: string;
}