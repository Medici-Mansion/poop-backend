import { Injectable } from '@nestjs/common'

import { GraphicsRepository } from '@/graphics/grahics.repository'

import { Api } from '@/shared/dtos/api.dto'
import { GetGraphicsResponseDTO } from '@/graphics/dtos/get-graphics-response.dto'
import { GetGraphicsRequestDTO } from '@/graphics/dtos/get-graphics-request.dto'
import { CreateGraphicsDTO } from '@/graphics/dtos/create-graphics.dto'
import { ExternalsService } from '@/externals/externals.service'
import { Transactional } from '@nestjs-cls/transactional'
import { ApiException } from '@/shared/exceptions/exception.interface'
import { GraphicType } from '@prisma/client'

@Injectable()
export class GraphicsService {
  constructor(
    private readonly externalsService: ExternalsService,
    private readonly graphicsRepository: GraphicsRepository,
  ) {}

  async getAllGraphicsByCategorOrType(
    getGraphicsRequestDTO: GetGraphicsRequestDTO,
  ) {
    const allGraphics = await this.graphicsRepository.findAllByCategoryOrType(
      getGraphicsRequestDTO,
    )

    return Api.OK(allGraphics.map((item) => new GetGraphicsResponseDTO(item)))
  }

  @Transactional()
  async createGraphic(createGraphicsDTO: CreateGraphicsDTO) {
    const isLottieFile = createGraphicsDTO.file.mimeType.includes('json')

    const isExistName = await this.graphicsRepository.findOneByName(
      createGraphicsDTO.name,
    )

    if (isExistName) {
      throw ApiException.CONFLICT
    }
    const { file, ...rest } = createGraphicsDTO
    const baseFolder = isLottieFile ? 'lottie' : 'gif'
    const graphicUrl = await this.externalsService.uploadFiles(
      [file],
      `graphics/${baseFolder}`,
    )
    const res = await this.graphicsRepository.create({
      ...rest,
      type: isLottieFile ? GraphicType.Lottie : GraphicType.GIF,
      url: graphicUrl[0].public_id,
    })
    return Api.OK(new GetGraphicsResponseDTO(res[0]))
  }
}
