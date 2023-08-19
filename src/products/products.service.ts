import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product) private productRepository: typeof Product
    ) {}

    async create(dto: CreateProductDto) {
        return await this.productRepository.create(dto);
    }

    async delete(id: string) {
        return await this.productRepository.destroy({ where: { id } });
    }

    async update(dto: UpdateProductDto) {
        const product = await this.getOne(dto.id);
        if (!product) {
            throw new BadGatewayException("can't find product");
        }
        await product.update({
            title: dto.title,
            description: dto.description,
            count: dto.count,
            price: dto.price,
            photo: dto.photo,
            isHide: dto.isHide,
            discountAmount: dto.discountAmount,
        });
        await product.save().catch((e) => {
            throw new Error(e);
        });
        return dto;
    }
    //TODO надо подумать т.к по id и по title искать хуйня т.к id uuid, a title string
    async getOne(search: string) {
        return await this.productRepository.findOne({
            where: {
                [Op.or]: [{ id: search }, { title: search }],
            },
        });
    }

    async getAll() {
        return await this.productRepository.findAll();
    }
}
