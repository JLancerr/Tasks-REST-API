import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIntro(): string {
    return `Welcome to the Tasks API! <br> Go to <a href="/api">/api</a> to access the Swagger API documentation.`;
  }
}