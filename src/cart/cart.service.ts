import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddToCartDto, UpdateProductInCartDto } from './dto';
import { UserService } from '@user/user.service'
import { ProductsService } from '@products/products.service'
import { UserCart } from './models'

@Injectable()
export class CartService {
    constructor(
        @InjectModel(UserCart) private userCartRepository: typeof UserCart,
        private readonly userService: UserService,
        private readonly productsService: ProductsService
    ) {}
    //TODO нужно count уменьшать типо купил и меньше стало
    async add(dto: AddToCartDto) {
        const user = await this.userService.getOneUser(dto.userId);
        const product = await this.productsService.getOne(dto.productId);
        if (!user || !product) {
            throw new NotFoundException();
        }
        if (product.isHide) {
            throw new BadRequestException('you cannot order this product');
        }

        product.count--;
        
        if (!product.count) {
            product.isHide = true;
        }
        await this.productsService.update(product, user.id);

        if (user.cart.length) {
            await user.$add('cart', product.id);
        } else {
            await user.$set('cart', [product.id]);
            user.cart = [product];
        }

        return product;
    }

    async remove(dto: AddToCartDto) {
        const user = await this.userService.getOneUser(dto.userId);
        const product = await this.productsService.getOne(dto.productId);
        if (!user || !product) {
            throw new NotFoundException();
        }
        product.count++;
        if (product.isHide && product.count) {
            product.isHide = false;
        }
        await this.productsService.update(product, user.id);
        await user.$remove('cart', dto.productId);
        return dto;
    }
    //TODO возможно нахуй мне не нужно это товары добавлять
    async updateCount(dto: UpdateProductInCartDto) {
        const user = await this.userService.getOneUser(dto.userId);
        if (!user) {
            throw new NotFoundException();
        }

        const currProductIndex = user.cart.findIndex(
            (obj) => obj.id === dto.userId
        );
        user.cart[currProductIndex].count = dto.count;

        user.save();
        return user.cart[currProductIndex];
    }

    async clear(id: string) {
        const user = await this.userService.getOneUser(id);
        if (!user) {
            throw new NotFoundException();
        }
        await this.userCartRepository.destroy({
            where: { userId: id },
            truncate: true,
        });
    }
}
