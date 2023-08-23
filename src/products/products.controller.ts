import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { RolesAuthGuard } from '@auth/guards';
import { CurrentUser, Roles } from '@shared/decorators';
import { JwtPayload } from '@auth/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) {}

    @Roles('ADMIN', 'SELLER')
    @UseGuards(RolesAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    async createProduct(
        @Body() dto: CreateProductDto,
        @CurrentUser() user: JwtPayload,
        @UploadedFile() file: Express.Multer.File
    ) {
        return await this.productsService.create(
            { ...dto, sellerId: user.id },
            file
        );
    }

    @Roles('ADMIN', 'SELLER')
    @UseGuards(RolesAuthGuard)
    @Delete('/:id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productsService.delete(id);
    }

    @Roles('ADMIN', 'SELLER')
    @UseGuards(RolesAuthGuard)
    @Put()
    async updateProduct(
        @Body() dto: UpdateProductDto,
        @CurrentUser() user: JwtPayload
    ) {
        return await this.productsService.update(dto, user.id);
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
