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
import { PhotoTypes } from '@enum'

//TODO возможно удалить роут т.к юзлес
@Controller('files')
export class FilesController {
    constructor(private readonly fileService: FilesService) {}

    @Post('')
    @UseInterceptors(FileInterceptor('image'))
    async createAvatar(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: JwtPayload
    ) {
        return await this.fileService.create(
            file,
            user.id,
            PhotoTypes.AVATARS
        );
    }
}
