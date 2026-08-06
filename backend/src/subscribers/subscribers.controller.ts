import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { ListSubscribersQueryDto } from './dto/list-subscribers.query';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Roles('admin')
  @Get()
  findAll(@Query() query: ListSubscribersQueryDto) {
    return this.subscribersService.findAll(query);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSubscriberDto) {
    return { data: await this.subscribersService.create(dto) };
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.subscribersService.remove(id);
  }
}
