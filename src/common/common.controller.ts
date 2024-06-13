import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'

import { GetBreedResponseDTO } from '@/breeds/dtos/get-breed.dto'

@ApiExtraModels(GetBreedResponseDTO)
@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(private readonly breedsService: BreedsService) {}

  // @Get('breeds')
  // @ApiOperation({
  //   summary: '견종정보 조회',
  //   description: '견종정보를 조회합니다.',
  // })
  // @ApiResultWithCursorResponse(GetBreedResponseDTO)
  // async getBreeds(@Query() getBreadRequestDTO: GetBreadRequestDTO) {
  //   return this.breedsService.getBreedsWithCursor(getBreadRequestDTO)
  // }

  @Get('breeds')
  @ApiOperation({
    summary: '견종정보 조회',
    description: '견종정보를 조회합니다.',
  })
  @ApiOkResponse({
    schema: {
      title: 'GetBreeds',

      additionalProperties: {
        title: '초성',
        type: 'array',
        items: {
          $ref: getSchemaPath(GetBreedResponseDTO),
        },
      },
    },
  })
  async getBreeds() {
    return this.breedsService.getAllBreeds()
  }
}
