import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'

import {
  GetBreadRequestDTO,
  GetBreedResponseDTO,
} from '@/breeds/dtos/get-breed.dto'
import { ApiResultWithCursorResponse } from '@/shared/dtos/common.dto'

@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(private readonly breedsService: BreedsService) {}

  @Get('breeds')
  @ApiOperation({
    summary: '견종정보 조회',
    description: '견종정보를 조회합니다.',
  })
  @ApiResultWithCursorResponse(GetBreedResponseDTO)
  async getBreeds(@Query() getBreadRequestDTO: GetBreadRequestDTO) {
    return this.breedsService.getBreedsWithCursor(getBreadRequestDTO)
  }
}
