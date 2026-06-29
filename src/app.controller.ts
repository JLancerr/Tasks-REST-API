import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Redirect('/api', 302)
  @Get()
  getIntro(): string {
    return this.appService.getIntro();
  }
}
