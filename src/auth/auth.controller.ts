import { AuthService } from './auth.service'
import { Body, Controller, Post } from '@nestjs/common'
import { AuthPayloadLoginDto } from './dto/authlogin.dto'
import { AuthPayloadSignupDto } from './dto/authsignup.dto'

@Controller('auth')
export class AuthController {

    constructor(private readonly authSService: AuthService) {}

    @Post("login")
    async login(@Body() payload: AuthPayloadLoginDto) {
        const validate = await this.authSService.validateUser(payload)
        if(validate) {
            return this.authSService.login(payload)
        }
    }

    @Post("signup")
    signup(@Body() payload: AuthPayloadSignupDto) {
        return this.authSService.signup(payload)
    }
}
