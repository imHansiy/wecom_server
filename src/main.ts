import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
    const config = new DocumentBuilder()
    .setTitle('企业微信')
    .setDescription('项目API')
    .setVersion('1.0')
    .addTag('Wecom')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/openapi', app, document);
// 启用CORS
app.enableCors()
  await app.listen(3000);

}

bootstrap();
