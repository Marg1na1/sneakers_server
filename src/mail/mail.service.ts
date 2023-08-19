import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto'

@Injectable()
export class MailService {
    async sendMail(dto: SendMailDto) {}
}
