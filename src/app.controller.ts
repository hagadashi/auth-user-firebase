import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  getHello(): any {
    return this.appService.health();
  }
}
