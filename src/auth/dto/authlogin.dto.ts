import { IsString, MinLength } from "class-validator"

export class AuthPayloadLoginDto {
    @IsString()
    email: string

    @IsString()
    @MinLength(6, {
        message: "Minimum 6 characters"
    })
    password: string
}