import { IsInt, IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    limit: number = 10;

    @IsOptional()
    @IsInt()
    @IsPositive()
    page: number = 1;
}