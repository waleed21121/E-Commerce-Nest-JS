import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ParseMongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { UserSpecificRoutesGuard } from 'src/auth/guards/user-specific-routes.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['admin'])
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user)
  }

  @UseGuards(AuthGuard)
  @Roles(['admin', 'user'])
  @Get()
  async getAllUsers(@Query() paginationQueryDto: PaginationQueryDto) {
    return await this.userService.getAllUser(paginationQueryDto);
  }

  @UseGuards(AuthGuard)
  @Roles(['admin', 'user'])
  @Get(':id')
  async findUser(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.userService.findOneById(id);
  }

  @UseGuards(AuthGuard, UserSpecificRoutesGuard)
  @Roles(['admin', 'user'])
  @Patch(':id')
  async updateUser(@Param('id', ParseMongoIdPipe) id: string, @Body() user: UpdateUserDto) {
    return await this.userService.updateUser(id, user);
  }

  @UseGuards(AuthGuard, UserSpecificRoutesGuard)
  @Roles(['admin', 'user'])
  @Delete(':id')
  async deleteUser(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.userService.deleteUser(id);
  }
}
