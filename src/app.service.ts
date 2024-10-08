import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  
  health(): any {
    return {
      status: 'Ok',
      message: 'API is Alive'
    };
  }

}
