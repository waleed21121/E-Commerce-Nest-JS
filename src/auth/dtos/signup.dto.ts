import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "src/user/dtos/create-user.dto";

export class SignupDto extends PickType(CreateUserDto, ['name', 'email', 'password', 'role'] as const) {}