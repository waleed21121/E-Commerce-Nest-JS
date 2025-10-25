import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IActiveUser } from "src/interfaces/active-user.interface";

export const ActiveUser = createParamDecorator((field: keyof IActiveUser | undefined, execution: ExecutionContext) => {
    const request = execution.switchToHttp().getRequest();
    if(field) {
        return request['user'][field];
    }
    return request['user'];
})