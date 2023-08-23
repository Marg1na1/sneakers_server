import {
    BadGatewayException,
    Injectable,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models';
import { Op } from 'sequelize';
import { UserService } from '@user/user.service';
import { FilesService } from '@files/files.service';
import { PhotoTypes } from '@enum';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product) private productRepository: typeof Product,
        private readonly userService: UserService,
        private readonly filesService: FilesService
    ) {}

    async create(dto: CreateProductDto, file: Express.Multer.File) {
        const product = await this.getOne(dto.title);
        if (product) {
            throw new ConflictException(
                'product with this title already exist'
            );
        }
        const createdProduct = await this.productRepository.create(dto);

        await this.filesService.create(
            file,
            createdProduct.id,
            PhotoTypes.PRODUCT_PHOTOS
        );

        return dto;
    }

    async delete(id: string) {
        return await this.productRepository.destroy({ where: { id } });
    }

    async update(dto: Partial<UpdateProductDto>, userId: string) {
        const curUser = await this.userService.getOneUser(userId);
        //TODO типизацию поправить и возможно в JwtPayload добавить поле roles
        //@ts-ignore
        if (dto.sellerId !== userId && curUser?.roles.includes('ADMIN')) {
            throw new ForbiddenException();
        }
        const product = await this.getOne(dto.id!);

        if (!product) {
            throw new BadGatewayException("can't find product");
        }
        await product.update({
            title: dto.title || product.title,
            description: dto.description || product.description,
            count: dto.count !== undefined ? dto.count : product.count,
            price: dto.price || product.price,
            isHide: dto.isHide !== undefined ? dto.isHide : product.isHide,
            discountAmount:
                dto.discountAmount !== undefined
                    ? dto.discountAmount
                    : product.discountAmount,
        });
        await product.save().catch((e) => {
            throw new Error(e);
        });
        return dto;
    }

    async getOne(search: string) {
        return await this.productRepository.findOne({
            where: {
                [Op.or]: [{ id: search }, { title: search }],
            },
        });
    }

    async getAll() {
        return await this.productRepository.findAll({
            include: ['photos'],
        });
    }
}
