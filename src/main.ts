import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  console.log(
    `🚀 GraphQL server ready at http://localhost:${port}/graphql`,
  );
}

void bootstrap();
