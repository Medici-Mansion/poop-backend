import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { BreedsService } from './breeds.service'
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { ApiResult } from '@/shared/decorators/swagger/response.decorator'
import { CommonCodes } from '@/shared/errors/code/common.code'
import {
  GetBreedResponseDTO,
  OrderBreedDTO,
} from './dtos/request/get-breed.dto'
import { Api } from '@/shared/dtos/api.dto'
import { FormDataRequest } from 'nestjs-form-data'
import { CreateBreedDTO } from './dtos/request/create-breed.dto'
import { UpdateBreedDTO } from './dtos/request/update-breed.dto'
import { UpdateBreedResponseDTO } from './dtos/response/update-breed-response.dto'
import { RemoveBreedsDTO } from './dtos/request/remove-breeds.dto'
import { Meta } from '@/shared/dtos/meta.dto'

@ApiExtraModels(GetBreedResponseDTO)
@ApiTags('Breeds')
@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Get('')
  @ApiOperation({
    summary: '견종정보 조회',
    description: '견종정보를 조회합니다.',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: GetBreedResponseDTO,
      exampleDescription: '조회 성공',
      exampleTitle: '조회 성공',
    },
  ])
  async getBreeds(): Promise<Api<GetBreedResponseDTO[]>> {
    const allBreeds = await this.breedsService.getAllBreeds()
    return Api.OK(allBreeds)
  }

  @Get('char')
  @ApiOperation({
    summary: '초성기반 견종정보 조회',
    description: '견종정보를 조회합니다.',
  })
  @ApiResult(CommonCodes.OK, [
    {
      model: GetBreedResponseDTO,
      exampleDescription: '조회 성공',
      exampleTitle: '조회 성공',
    },
  ])
  async getBreedsWithCursor(
    @Query() orderBreedDTO: OrderBreedDTO,
  ): Promise<Api<{ data: { [key: string]: GetBreedResponseDTO[] } } & Meta>> {
    const allBreeds =
      await this.breedsService.getAllBreedsWithCursor(orderBreedDTO)
    return Api.OK(allBreeds)
  }

  @Put()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '견종 생성',
    description: '견종을 생성합니다.',
  })
  @ApiCreatedResponse({
    type: Boolean,
  })
  @FormDataRequest()
  async createProfile(
    @Body() createBreedDTO: CreateBreedDTO,
  ): Promise<Api<boolean>> {
    const response = await this.breedsService.createBreed(createBreedDTO)
    return Api.OK(response)
  }

  @Post('')
  @ApiOperation({
    summary: '견종 정보 수정',
    description: '견종 아이디에 맞는 요소의 정보를 수정합니다.',
  })
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiResult(CommonCodes.OK, [
    {
      model: UpdateBreedResponseDTO,
      exampleDescription: '수정 성공',
      exampleTitle: '수정 성공',
    },
  ])
  async updateBreed(
    @Body() updateBreedDTO: UpdateBreedDTO,
  ): Promise<Api<UpdateBreedResponseDTO>> {
    const updateGraphicReponseDTO =
      await this.breedsService.updateBreed(updateBreedDTO)

    return Api.OK(updateGraphicReponseDTO)
  }

  @Delete('')
  @ApiOperation({
    summary: '견종 정보 삭제',
    description: '선택한 견종 정보를 삭제합니다.',
  })
  @ApiResult(CommonCodes.DELETE, [
    {
      model: Boolean,
      exampleDescription: '삭제 성공',
      exampleTitle: '삭제 성공',
    },
  ])
  async removeBreeds(
    @Body() removeBreedsDTO: RemoveBreedsDTO,
  ): Promise<Api<Promise<boolean>>> {
    return Api.OK(this.breedsService.removeBreeds(removeBreedsDTO))
  }
}
