import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { VersioningType } from '@nestjs/common';
import * as session from 'express-session';
import { emitGQLSchemaFile } from './gql-schema';
import { checkEnvironmentAuthProvider } from './utils';

async function bootstrap() {
  console.log(`Running in production: ${process.env.PRODUCTION}`);
  console.log(`Port: ${process.env.PORT}`);

  checkEnvironmentAuthProvider();

  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
    }),
  );

  // Increase fil upload limit to 50MB
  app.use(
    json({
      limit: '100mb',
    }),
  );

  if (process.env.PRODUCTION === 'false') {
    console.log('Enabling CORS with development settings');

    app.enableCors({
      origin: process.env.WHITELISTED_ORIGINS.split(','),
      credentials: true,
    });
  } else {
    console.log('Enabling CORS with production settings');

    app.enableCors({
      origin: process.env.WHITELISTED_ORIGINS.split(','),
      credentials: true,
    });
  }
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3170);
}

if (!process.env.GENERATE_GQL_SCHEMA) {
  bootstrap();
} else {
  emitGQLSchemaFile();
}
