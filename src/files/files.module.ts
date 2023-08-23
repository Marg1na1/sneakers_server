import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesController } from './files.controller';
import { ImageFile } from './models';
import { ProductPhoto } from '@products/models/product-photo.model'

@Module({
    providers: [FilesService],
    exports: [FilesService],
    imports: [SequelizeModule.forFeature([ImageFile, ProductPhoto])],
    controllers: [FilesController],
})
export class FilesModule {}
