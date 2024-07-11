import {
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'

import { BreedsService } from '@/breeds/breeds.service'

import { GetBreedResponseDTO } from '@/breeds/dtos/get-breed.dto'
import { GraphicsService } from '@/graphics/graphics.service'
import { ApiResult } from '@/shared/decorators/swagger/response.decorator'
import { CommonCodes } from '@/shared/errors/code/common.code'
import { GetGraphicsResponseDTO } from '@/graphics/dtos/get-graphics-response.dto'
import {
  GetGraphicByIdRequestDTO,
  GetGraphicsRequestDTO,
} from '@/graphics/dtos/get-graphics-request.dto'
import { CreateGraphicsDTO } from '@/graphics/dtos/create-graphics.dto'
import { FormDataRequest } from 'nestjs-form-data'
import { Api } from '@/shared/dtos/api.dto'
import { UpdateGraphicsDTO } from '@/graphics/dtos/update-graphics.dto'
import { GraphicsCode, GraphicsCodes } from '@/graphics/graphics.exception'
import { RemoveGraphicsDTO } from '@/graphics/dtos/remove-graphics.dto'

@ApiExtraModels(GetBreedResponseDTO)
@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(
    private readonly breedsService: BreedsService,
    private readonly graphicsService: GraphicsService,
  ) {}

  @Get('breeds')
  @ApiOperation({
    summary: '견종정보 조회',
    description: '견종정보를 조회합니다.',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: [GetBreedResponseDTO],
      exampleDescription: '조회 성공',
      exampleTitle: '조회 성공',
    },
  ])
  async getBreeds() {
    return this.breedsService.getAllBreeds()
  }

  @Get('graphics')
  @ApiOperation({
    summary: '그래픽 정보 전체 조회',
    description:
      '그래픽 정보 전체를 조회합니다. 그래픽타입, 카테고리 필터와 정렬 순서를 변경할 수 있습니다.',
  })
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
  async getAllGraphics(
    @Query() getGraphicsRequestDTO: GetGraphicsRequestDTO,
  ): Promise<Api<GetGraphicsResponseDTO[]>> {
    return this.graphicsService.getAllGraphicsByCategorOrType(
      getGraphicsRequestDTO,
    )
  }

  @Get('graphics/:id')
  @ApiOperation({
    summary: '그래픽 정보 단건 조회',
    description: '아이디를 통해 그래픽 정보 단건을 조회합니다.',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: GetGraphicsResponseDTO,
      exampleDescription: '조회 성공',
      exampleTitle: '조회 성공',
    },
  ])
  @ApiResult(CommonCodes.BAD_REQUEST, [
    {
      model: Function,
      result: GraphicsCodes[GraphicsCode.NOTFOUND](),
      exampleDescription: '유효하지 않은 아이디에요.',
      exampleTitle: '아이디 유효성 오류',
    },
    {
      model: Function,
      result: CommonCodes.BAD_REQUEST(),
      exampleDescription: '존재하지 않는 그래픽 아이디',
      exampleTitle: '조회 실패',
    },
  ])
  async getGraphicById(
    @Param() getGraphicByIdRequestDTO: GetGraphicByIdRequestDTO,
  ): Promise<Api<GetGraphicsResponseDTO>> {
    return this.graphicsService.getGraphicById(getGraphicByIdRequestDTO)
  }

  @Put('graphics')
  @ApiOperation({
    summary: '그래픽 정보 등록',
    description: '그래픽 정보를 등록(생성) 합니다. ',
  })
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiResult(CommonCodes.OK, [
    {
      model: GetGraphicsResponseDTO,
      exampleDescription: '생성 성공',
      exampleTitle: '생성 성공',
    },
  ])
  async createGraphic(
    @Body() createGraphicsDTO: CreateGraphicsDTO,
  ): Promise<Api<GetGraphicsResponseDTO>> {
    return this.graphicsService.createGraphic(createGraphicsDTO)
  }

  @Post('graphics')
  @ApiOperation({
    summary: '그래픽 정보 수정',
    description: '그래픽 아이디에 맞는 요소의 정보를 수정합니다.',
  })
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiResult(CommonCodes.OK, [
    {
      model: GetGraphicsResponseDTO,
      exampleDescription: '수정 성공',
      exampleTitle: '수정 성공',
    },
  ])
  async updateGraphic(
    @Body() updateGraphicsDTO: UpdateGraphicsDTO,
  ): Promise<Api<GetGraphicsResponseDTO>> {
    return this.graphicsService.updateGraphic(updateGraphicsDTO)
  }

  @Delete('graphic')
  @ApiOperation({
    summary: '그래픽 정보 삭제',
    description: '선택한 그래픽을 삭제합니다.',
  })
  @ApiResult(CommonCodes.DELETE, [
    {
      model: Boolean,
      exampleDescription: '삭제 성공',
      exampleTitle: '삭제 성공',
    },
  ])
  async removeGraphic(@Body() removeGraphicsDTO: RemoveGraphicsDTO) {
    return this.graphicsService.removeGraphic(removeGraphicsDTO)
  }
}
