import { Controller } from '@nestjs/common';
import { ToonService } from './toon.service';

@Controller('toon')
export class ToonController {
  constructor(private readonly toonService: ToonService) {}
}
