import {
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { Body, Controller, Get, Put, Query } from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'

import { GetBreedResponseDTO } from '@/breeds/dtos/get-breed.dto'
import { GraphicsService } from '@/graphics/graphics.service'
import { ApiResult } from '@/shared/decorators/swagger/response.decorator'
import { CommonCodes } from '@/shared/errors/code/common.code'
import { GetGraphicsResponseDTO } from '@/graphics/dtos/get-graphics-response.dto'
import { GetGraphicsRequestDTO } from '@/graphics/dtos/get-graphics-request.dto'
import { CreateGraphicsDTO } from '@/graphics/dtos/create-graphics.dto'
import { FormDataRequest } from 'nestjs-form-data'

@ApiExtraModels(GetBreedResponseDTO)
@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(
    private readonly breedsService: BreedsService,
    private readonly graphicsService: GraphicsService,
  ) {}

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

  @ApiResult(CommonCodes.OK, [
    {
      model: GetGraphicsResponseDTO,
      exampleDescription: '조회 성공',
      exampleTitle: '조회 성공',
      custom: {
        properties: {
          body: {
            type: 'array',
            items: {
              $ref: getSchemaPath(GetGraphicsResponseDTO),
            },
          },
        },
      },
    },
  ])
  @Get('graphics')
  async getAllGraphics(@Query() getGraphicsRequestDTO: GetGraphicsRequestDTO) {
    return this.graphicsService.getAllGraphicsByCategorOrType(
      getGraphicsRequestDTO,
    )
  }

  @Put('graphics')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiResult(CommonCodes.OK, [
    {
      model: GetGraphicsResponseDTO,
      exampleDescription: '생성 성공',
      exampleTitle: '생성 성공',
    },
  ])
  async createGraphic(@Body() createGraphicsDTO: CreateGraphicsDTO) {
    return this.graphicsService.createGraphic(createGraphicsDTO)
  }
}
