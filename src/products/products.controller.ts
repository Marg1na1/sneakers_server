import { ProductsService } from './products.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.model';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private jwtService: JwtService
    ) {}
    //TODO role guard ADMIN, SELLER
    @Post()
    async createProduct(@Body() dto: CreateProductDto, @Req() req: Request) {
        //TODO возможно вынести в декоратор или хелпер
        const authHeader = req.headers.authorization;
        const user: User = this.jwtService.verify(authHeader!.split(' ')[1]);
        return await this.productsService.create(
            dto.sellerId ? dto : { ...dto, sellerId: user.id }
        );
    }
    @Delete('/:id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productsService.delete(id);
    }
    @Put()
    async updateProduct(@Body() dto: UpdateProductDto, @Req() req: Request) {
        const authHeader = req.headers.authorization;
        const user: User = this.jwtService.verify(authHeader!.split(' ')[1]);
        return await this.productsService.update(
            dto.sellerId ? dto : { ...dto, sellerId: user.id }
        );
    }

    @Get('/:search')
    async getOneProduct(@Param('search') search: string) {
        return await this.productsService.getOne(search);
    }
    @Get()
    async getAllProducts() {
        return await this.productsService.getAll();
    }
}
