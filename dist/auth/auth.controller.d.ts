import { AuthService } from './auth.service';
import { loginDto, modifyUserDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(signInDto: loginDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    modifyUser(modifyUserDto: modifyUserDto): Promise<{}>;
}
