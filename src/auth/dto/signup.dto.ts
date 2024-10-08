import { IsAlpha, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { SigninDto } from "./signin.dto";


export class SignupDto extends SigninDto {
    
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsAlpha()
    firstName: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsAlpha()
    lastName: string;

}
