import * as bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { JwtService } from '@nestjs/jwt'
import { AuthPayloadLoginDto } from './dto/authlogin.dto'
import { Injectable, HttpException } from '@nestjs/common'
import { AuthPayloadSignupDto } from './dto/authsignup.dto'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly db: DatabaseService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(payload: AuthPayloadLoginDto) {
        const { email, password } = payload
        if(!email || !password) {
            throw new HttpException("All field is required", 400)
        }
        const user = await this.db.user.findFirst({
            where: {
                email
            }
        })
        if(!user) {
            throw new HttpException("Email not found", 400)
        }
        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword) {
            throw new HttpException("Password incorrect", 400)
        }
        const { password: userPassword, ...userData } = user
        return userData
    }

    async login(payload: AuthPayloadLoginDto) {
        const accessToken = await this.jwtService.sign(payload)
        return accessToken
    }

    async signup(payload: AuthPayloadSignupDto ) {
        const { username, email, password } = payload
        const user = await this.db.user.findFirst({
            where: {email}
        })
        if(user) {
            throw new HttpException("Email already used", 400)
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const res = await this.db.user.create({
            data: {
                id: uuid(),
                username,
                email, 
                password: hashPassword
            }
        })
        return {
            status: "success",
            message: "new user has created",
            data: {
                ...res
            }
        }
    }
}
