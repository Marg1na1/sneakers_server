import { InjectModel } from '@nestjs/sequelize';
import { ConflictException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 } from 'uuid';
import * as sharp from 'sharp';
import { Op } from 'sequelize';
import { ImageFile } from './models';
import { ProductPhoto } from '@products/models/product-photo.model';
import { PhotoTypes } from '@enum'

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(ImageFile) private imageFileRepository: typeof ImageFile,
        @InjectModel(ProductPhoto)
        private productPhotoRepository: typeof ProductPhoto
    ) {}

    async find(search: string, type: PhotoTypes) {
        switch (type) {
            case PhotoTypes.AVATARS:
                return await this.imageFileRepository.findOne({
                    where: {
                        [Op.or]: [{ id: search }, { userId: search }],
                    },
                });
            case PhotoTypes.PRODUCT_PHOTOS:
                return await this.productPhotoRepository.findOne({
                    where: {
                        [Op.or]: [{ id: search }, { productId: search }],
                    },
                });
        }
    }

    async delete(id: string) {
        return await this.imageFileRepository.destroy({
            where: { id },
        });
    }

    async writeOnFs(file: Express.Multer.File, id: string, type: PhotoTypes) {
        const image = await this.find(id, type);

        if (image) {
            await this.delete(image.id);
            fs.unlink(
                path.join(__dirname, '..', 'uploads', type, image!.filename),
                (err) => {
                    if (err) {
                        throw err;
                    }
                }
            );
        }
        const currentFile = file;
        const fileExtension = file.originalname.split('.')[1];
        if (fileExtension === 'svg') {
            throw new ConflictException("don't use svg format for image");
        }
        const meta = await sharp(currentFile.buffer).webp().toBuffer();
        currentFile.buffer = meta;
        const fileName = `${v4()}.webp`;
        const filePath = path.join(__dirname, '..', 'uploads', type);
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }
        fs.writeFileSync(path.join(filePath, fileName), currentFile.buffer);

        return {
            fileName,
            originalname: currentFile.originalname,
            size: currentFile.size,
            mimetype: currentFile.mimetype,
        };
    }

    async create(file: Express.Multer.File, id: string, type: PhotoTypes) {
        const { fileName, originalname, size, mimetype } = await this.writeOnFs(
            file,
            id,
            type
        );
        switch (type) {
            case PhotoTypes.AVATARS:
                return await this.imageFileRepository.create({
                    filename: fileName,
                    originalName: originalname,
                    size: size,
                    mimetype: mimetype,
                    userId: id,
                });
            case PhotoTypes.PRODUCT_PHOTOS:
                return await this.productPhotoRepository.create({
                    filename: fileName,
                    originalName: originalname,
                    size: size,
                    mimetype: mimetype,
                    productId: id,
                });
        }
    }
}
