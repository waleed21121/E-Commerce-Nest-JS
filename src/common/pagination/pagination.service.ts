import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { Document, Model, Schema } from 'mongoose';
import { PaginationResult } from './interfaces/pagination-result.interface';

@Injectable()
export class PaginationService {
    constructor(@Inject(REQUEST) private request: Request) { }

    async paginateQuery<T extends Document, D extends Object>(
        paginationQueryDto: PaginationQueryDto,
        model: Model<T>,
        populateFields?: (keyof D)[]
    ): Promise<PaginationResult<T>> {
        const skip = (paginationQueryDto.page - 1) * paginationQueryDto.limit;
        const limit = paginationQueryDto.limit;

        let query = model.find().skip(skip).limit(limit);
        if(populateFields) {
            query.populate(populateFields as string[], '-__v').select('-__v')
        }


        const totalItems = await model.countDocuments();
        const totalPages = Math.ceil(totalItems / paginationQueryDto.limit);
        const nextPage = Math.min(totalPages, paginationQueryDto.page + 1);
        const previousPage = Math.max(1, paginationQueryDto.page - 1);
        const baseUrl = `${this.request.protocol}://${this.request.headers.host}/`;
        const urlObject = new URL(this.request.url, baseUrl);
        const moduleUrl = `${urlObject.origin}${urlObject.pathname}`;

        const result = await query;
        const response: PaginationResult<T> = {
            data: result,
            meta: {
                itemsPerPage: paginationQueryDto.limit,
                totalItems: totalItems,
                currentPage: paginationQueryDto.page,
                totalPages: totalPages
            },
            links: {
                first: `${moduleUrl}?page=1&limit=${paginationQueryDto.limit}`,
                last: `${moduleUrl}?page=${totalPages}&limit=${paginationQueryDto.limit}`,
                current: `${moduleUrl}?page=${paginationQueryDto.page}&limit=${paginationQueryDto.limit}`,
                next: `${moduleUrl}?page=${nextPage}&limit=${paginationQueryDto.limit}`,
                previous: `${moduleUrl}?page=${previousPage}&limit=${paginationQueryDto.limit}`,
            }
        }
        return response;
    }
}
