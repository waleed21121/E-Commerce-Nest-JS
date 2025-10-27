import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { Document, FilterQuery, Model, Schema, SortOrder } from 'mongoose';
import { PaginationResult } from './interfaces/pagination-result.interface';
import { ProductDocument } from 'src/product/schemas/product.schema ';

@Injectable()
export class PaginationService {
    constructor(@Inject(REQUEST) private request: Request) { }

    async paginateQuery<T extends Document, D extends Object>(
        paginationQueryDto: PaginationQueryDto,
        model: Model<T>,
        populateFields?: (keyof D)[],
        filters?: Object,
    ): Promise<PaginationResult<T>> {
        // Pagination
        const skip = (paginationQueryDto.page - 1) * paginationQueryDto.limit;
        const limit = paginationQueryDto.limit;

        // filters & sort
        let findWherOptions: FilterQuery<ProductDocument> = {};
        let sortOptions: Record<string, SortOrder> = {};

        if (filters) {
            // console.log(model.schema.obj);
            Object.keys(filters).forEach((key) => {

                // extracting filters
                const [attribute, operator] = key.split('_');
                //console.log(Object.keys(model.schema.obj).includes(attribute));

                if (Object.keys(model.schema.obj).includes(attribute)) {
                    if (operator === 'gte') {
                        Object.defineProperty(findWherOptions, attribute, {
                            value: { $gte: filters[key] },
                            enumerable: true
                        })
                    } else if (operator === 'lte') {
                        Object.defineProperty(findWherOptions, attribute, {
                            value: { $lte: filters[key] },
                            enumerable: true
                        })
                    } else {
                        Object.defineProperty(findWherOptions, attribute, {
                            value: filters[key],
                            enumerable: true
                        })
                    }
                } else if (attribute === 'sort') {
                    const fields: string[] = (filters[key]).split(',');
                    fields.forEach((field) => {
                        const [attribute, order] = field.split('_');
                        if ((order === 'asc' || order === 'desc') && Object.keys(model.schema.obj).includes(attribute)) {
                            Object.defineProperty(sortOptions, attribute, {
                                value: order,
                                enumerable: true
                            })
                        }
                    })

                    //console.log(sortOptions);
                }
            })
            
            // console.log(findWherOptions);
        }


        let query = model.find(findWherOptions).skip(skip).limit(limit).sort(sortOptions);
        if (populateFields) {
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
