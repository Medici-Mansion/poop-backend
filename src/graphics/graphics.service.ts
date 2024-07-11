import { Injectable } from '@nestjs/common'
import { GraphicType } from '@/database/enums'

import { GraphicsRepository } from '@/graphics/grahics.repository'

import { ExternalsService } from '@/externals/externals.service'

import { GetGraphicsResponseDTO } from '@/graphics/dtos/get-graphics-response.dto'
import {
  GetGraphicByIdRequestDTO,
  GetGraphicsRequestDTO,
} from '@/graphics/dtos/get-graphics-request.dto'
import { CreateGraphicsDTO } from '@/graphics/dtos/create-graphics.dto'
import { UpdateGraphicsDTO } from '@/graphics/dtos/update-graphics.dto'
import { Transactional } from '@nestjs-cls/transactional'
import { ApiException } from '@/shared/exceptions/exception.interface'
import { RemoveGraphicsDTO } from './dtos/remove-graphics.dto'
@Injectable()
export class GraphicsService {
  constructor(
    private readonly externalsService: ExternalsService,
    private readonly graphicsRepository: GraphicsRepository,
  ) {}

  async getAllGraphicsByCategorOrType(
    getGraphicsRequestDTO: GetGraphicsRequestDTO,
  ): Promise<GetGraphicsResponseDTO[]> {
    const allGraphics = await this.graphicsRepository.findAllByCategoryOrType(
      getGraphicsRequestDTO,
    )

    return allGraphics.map((item) => new GetGraphicsResponseDTO(item))
  }

  async getGraphicById(
    getGraphicByIdRequestDTO: GetGraphicByIdRequestDTO,
  ): Promise<GetGraphicsResponseDTO> {
    const foundGraphic = await this.graphicsRepository.findOne(
      getGraphicByIdRequestDTO.id,
    )
    return new GetGraphicsResponseDTO(foundGraphic)
  }

  @Transactional()
  async createGraphic(
    createGraphicsDTO: CreateGraphicsDTO,
  ): Promise<GetGraphicsResponseDTO> {
    const isLottieFile = createGraphicsDTO.file.mimeType.includes('json')

    const isExistName = await this.graphicsRepository.findOneByName(
      createGraphicsDTO.name,
    )

    if (isExistName) {
      throw ApiException.CONFLICT
    }
    const { file, ...rest } = createGraphicsDTO
    const baseFolder = isLottieFile ? 'lottie' : 'gif'
    const graphicUrl = await this.externalsService.uploadFiles({
      files: [file],
      folder: `graphics/${baseFolder}`,
    })

    const res = await this.graphicsRepository.create({
      ...rest,
      type: isLottieFile ? GraphicType.Lottie : GraphicType.GIF,
      url: graphicUrl[0],
    })
    return new GetGraphicsResponseDTO(res[0])
  }

  @Transactional()
  async updateGraphic(
    updateGraphicsDTO: UpdateGraphicsDTO,
  ): Promise<GetGraphicsResponseDTO> {
    const foundGraphic = await this.graphicsRepository.findOne(
      updateGraphicsDTO.id,
    )

    if (updateGraphicsDTO.name) {
      const isExistName = await this.graphicsRepository.findOneByName(
        updateGraphicsDTO.name,
      )
      if (isExistName && isExistName.id !== foundGraphic.id) {
        throw ApiException.CONFLICT
      }
    }

    let graphicUrl = ''

    if (updateGraphicsDTO.file) {
      const isLottieFile = updateGraphicsDTO.file.mimeType.includes('json')
      const baseFolder = isLottieFile ? 'lottie' : 'gif'
      const uploadResponse = await this.externalsService.uploadFiles({
        files: [updateGraphicsDTO.file],
        folder: `graphics/${baseFolder}`,
      })
      graphicUrl = uploadResponse[0]
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { file: _, ...updateValues } = updateGraphicsDTO
    const updateResponse = await this.graphicsRepository.update({
      ...(graphicUrl ? { url: graphicUrl } : {}),
      ...updateValues,
    })

    return new GetGraphicsResponseDTO(updateResponse)
  }

  @Transactional()
  async removeGraphic(removeGraphicsDTO: RemoveGraphicsDTO) {
    await this.graphicsRepository.removeGraphic(removeGraphicsDTO.id)
    return true
  }
}
