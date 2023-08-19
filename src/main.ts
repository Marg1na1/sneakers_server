import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(cookieParser());
    await app.listen(PORT!, () => console.log(`server start at ${PORT}`));
}
bootstrap();
