import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  // swagger
  const config = new DocumentBuilder()
    .setTitle("NestJS API")
    .setDescription("User, Auth va Product Api documentation")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        name: "JWT",
        bearerFormat: "JWT",
        description: "Enter JWt token",
        in: "header",
      },
      "JWT_auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use("/uploads", express.static("uploads"));

  const PORT = process.env.PORT ?? 3000;

  await app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
    console.log(`Documantation link: http://localhost:${PORT}/api`);
  });
}
bootstrap();
