import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as helmet from 'helmet';
import 'dotenv/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PlayerService } from './player/player.service';

declare const module: any;

async function bootstrap() {
  // nest & fastify init
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // security
  app.use(helmet());

  // global headers
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    next();
  });

  // swagger documentation
  const options = new DocumentBuilder()
    .setTitle('Q')
    .setDescription('API articles et auteurs')
    .setVersion('1.0')
    .addTag('Q')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  // run service for each existing room
  const playerService = app.get(PlayerService);
  try {
    playerService.run();
  } catch (e) {
    console.log(e);
  }

  // hot reload for dev
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // run server
  await app.listen(8080, '0.0.0.0');
  console.log(`Running server on: ${await app.getUrl()}`);
}

bootstrap();
