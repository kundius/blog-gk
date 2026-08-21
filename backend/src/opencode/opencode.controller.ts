import { Body, Controller, Get, Post } from '@nestjs/common';
import { OpencodeService } from './opencode.service';
import { SeoService } from './seo.service';
import { ArticleContentDto } from './dto/article-content.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('opencode')
export class OpencodeController {
  constructor(
    private readonly opencodeService: OpencodeService,
    private readonly seoService: SeoService,
  ) {}

  @Public()
  @Get('hello')
  async hello() {
    const response = await this.opencodeService.run(
      'Привет! Поздоровайся одним предложением.',
    );
    return { response };
  }

  @Roles('admin')
  @Post('seo/optimize')
  async optimizeSeo(@Body() dto: ArticleContentDto) {
    return { data: await this.seoService.optimizeSeo(dto) };
  }

  @Roles('admin')
  @Post('content/alts')
  async fillAlts(@Body() dto: ArticleContentDto) {
    return { data: await this.seoService.fillAlts(dto) };
  }
}