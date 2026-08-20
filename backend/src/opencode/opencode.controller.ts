import { Controller, Get } from '@nestjs/common';
import { OpencodeService } from './opencode.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('opencode')
export class OpencodeController {
  constructor(private readonly opencodeService: OpencodeService) {}

  @Public()
  @Get('hello')
  async hello() {
    const response = await this.opencodeService.run(
      'Привет! Поздоровайся одним предложением.',
    );
    return { response };
  }
}