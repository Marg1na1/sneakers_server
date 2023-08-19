import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '@shared/decorators';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtPayload } from 'src/auth/interfaces';

@Controller('files')
export class FilesController {
    constructor(private readonly fileService: FilesService) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: JwtPayload
    ) {
        return await this.fileService.create(file, user);
    }
}
