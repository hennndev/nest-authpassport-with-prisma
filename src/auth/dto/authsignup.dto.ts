import { IsString, MinLength } from "class-validator";


export class AuthPayloadSignupDto {
    @IsString()
    username: string

    @IsString()
    email: string

    @IsString()
    @MinLength(6, {
        message: "Minimum 6 characters"
    })
    password: string
}