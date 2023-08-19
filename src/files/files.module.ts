import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImageFile } from './models/image.model';
import { FilesController } from './files.controller';

@Module({
    providers: [FilesService],
    exports: [FilesService],
    imports: [SequelizeModule.forFeature([ImageFile])],
    controllers: [FilesController],
})
export class FilesModule {}
