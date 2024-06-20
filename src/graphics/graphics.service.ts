import { Injectable } from '@nestjs/common'
import { GraphicsRepository } from '@/graphics/grahics.repository'
import { GetGraphicsResponseDTO } from './dtos/get-graphics-response.dto'

@Injectable()
export class GraphicsService {
  constructor(private readonly graphicsRepository: GraphicsRepository) {}

  async getAllGraphics() {
    const allGraphics = await this.graphicsRepository.findAll()

    return allGraphics.map((item) => new GetGraphicsResponseDTO(item))
  }
}
