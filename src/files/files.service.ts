import { InjectModel } from '@nestjs/sequelize';
import { ImageFile } from './models/image.model';
import { ConflictException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 } from 'uuid';
import { JwtPayload } from 'src/auth/interfaces';
import * as sharp from 'sharp';
import { Op } from 'sequelize';

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(ImageFile) private imageFileRepository: typeof ImageFile
    ) {}

    async find(search: string) {
        return await this.imageFileRepository.findOne({
            where: {
                [Op.or]: [{ id: search }, { userId: search }],
            },
        });
    }

    async delete(id: string) {
        return await this.imageFileRepository.destroy({
            where: { id },
        });
    }

    async create(file: Express.Multer.File, user: JwtPayload) {
        const image = await this.find(user.id);
        if (image) {
            await this.delete(image.id);
            fs.unlink(
                path.join(__dirname, '..', 'uploads', image.filename),
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
            throw new ConflictException();
        }
        const meta = await sharp(currentFile.buffer).webp().toBuffer();
        currentFile.buffer = meta;
        const fileName = `${v4()}.webp`;
        const filePath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }
        fs.writeFileSync(path.join(filePath, fileName), currentFile.buffer);
        const fileData = {
            filename: fileName,
            originalName: currentFile.originalname,
            size: currentFile.size,
            mimetype: currentFile.mimetype,
            userId: user.id,
        };
        await this.imageFileRepository.create(fileData);
        return fileData;
    }
}
