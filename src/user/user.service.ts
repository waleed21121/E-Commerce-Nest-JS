import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider,
        private readonly paginationService: PaginationService,
    ) { }

    async getAllUser(paginationDto: PaginationQueryDto) {
        return await this.paginationService.paginateQuery<UserDocument>(paginationDto, this.userModel)
    }

    async createUser(userDto: CreateUserDto) {
        const exist = await this.userModel.findOne({ email: userDto.email });
        if (exist) {
            throw new BadRequestException(`User with the given email: ${userDto.email} already exist`);
        }

        userDto.role = userDto.role || 'user';
        userDto.password = await this.hashingProvider.hash(userDto.password);

        let newUser = await this.userModel.create(userDto);
        newUser = await newUser.save();
        return newUser;
    }

    async findOneById(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    async updateUser(id: string, userUpdates: UpdateUserDto) {
        if (userUpdates.password) {
            userUpdates.password = await this.hashingProvider.hash(userUpdates.password)
        }

        const user = await this.userModel.findByIdAndUpdate(id, userUpdates, {
            new: true
        });

        if (!user) {
            throw new NotFoundException(`User with the given id: ${id} is not exist`);
        }

        return user;
    }

    async deleteUser(id: string) {
        const user = await this.userModel.findByIdAndDelete(id, {
            new: true
        });

        if (!user) {
            throw new NotFoundException(`User with the given id: ${id} is not exist`);
        }

        return user;
    }

    async findUserByEmail(email: string) {
        return await this.userModel.findOne({email: email});
    }
}
