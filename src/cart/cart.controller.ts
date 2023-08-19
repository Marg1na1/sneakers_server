import { CartService } from './cart.service';
import { Controller, Post, Delete, Param, Body, Patch } from '@nestjs/common';
import { CurrentUser } from '@shared/decorators';
import { JwtPayload } from 'src/auth/interfaces';
import { UpdateProductInCartDto } from './dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}
    @Post('/clear')
    async clearCart(@CurrentUser() user: JwtPayload) {
        return await this.cartService.clear(user.id);
    }
    @Post('/:id')
    async addToCart(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
        return await this.cartService.add({ productId: id, userId: user.id });
    }

    @Delete('/:id')
    async removeFromCart(
        @Param('id') id: string,
        @CurrentUser() user: JwtPayload
    ) {
        return await this.cartService.remove({
            userId: user.id,
            productId: id,
        });
    }

    @Patch()
    async updateProductInCart(@Body() dto: UpdateProductInCartDto) {
        return await this.cartService.updateCount(dto);
    }
}
