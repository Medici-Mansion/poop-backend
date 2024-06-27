import { Body, Controller, Put } from '@nestjs/common'
import { BreedsService } from './breeds.service'
import { DB } from '@/database/types'

@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Put()
  async createBreed(@Body() data: Partial<DB['breeds']>) {
    return this.breedsService.createBreed(data)
  }
}
