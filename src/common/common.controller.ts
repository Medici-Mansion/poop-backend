import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'

import {
  GetBreedRequestDTO,
  GetBreedResponseDTO,
} from '@/breeds/dtos/get-breed.dto'
import { WithCursor } from '@/shared/dtos/with-cursor.dto'

@ApiExtraModels(GetBreedResponseDTO, WithCursor)
@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(private readonly breedsService: BreedsService) {}

  @Get('breeds/cursor')
  @ApiOperation({
    summary: '견종정보 조회',
    description: '견종정보를 조회합니다.',
  })
  async getBreedsCursor(@Query() getBreedRequestDTO: GetBreedRequestDTO) {
    return this.breedsService.getBreedsByCursor(getBreedRequestDTO)
  }

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
          allOf: [
            {
              $ref: getSchemaPath(GetBreedResponseDTO),
            },
          ],
        },
      },
    },
  })
  async getBreeds() {
    return this.breedsService.getAllBreeds()
  }
}
