import { Module } from '@nestjs/common';
import { OpencodeController } from './opencode.controller';
import { OpencodeService } from './opencode.service';
import { WordstatService } from './wordstat.service';
import { SeoService } from './seo.service';

@Module({
  controllers: [OpencodeController],
  providers: [OpencodeService, WordstatService, SeoService],
})
export class OpencodeModule {}