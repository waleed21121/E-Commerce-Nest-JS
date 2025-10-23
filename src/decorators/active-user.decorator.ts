import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ActiveUser = createParamDecorator((field: string | undefined, execution: ExecutionContext) => {
    const request = execution.switchToHttp().getRequest();
    return request['user'];
})