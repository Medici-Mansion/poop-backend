import { Injectable, NotFoundException } from '@nestjs/common'

import { GetBreedResponseDTO } from '@/breeds/dtos/get-breed.dto'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class BreedsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    const foundBreeds = await this.prismaService.breed.findUnique({
      where: {
        id,
      },
    })
    if (!foundBreeds) throw new NotFoundException()
    return foundBreeds
  }

  async getAllBreeds() {
    const allBreeds = await this.prismaService.searchBreeds.findMany({
      orderBy: {
        nameKR: 'asc',
      },
    })

    const breedsObj = allBreeds.reduce((acc, cur) => {
      if (!acc[cur.searchKey]) {
        acc[cur.searchKey] = []
      }

      acc[cur.searchKey].push(new GetBreedResponseDTO(cur))
      return acc
    }, {})

    return breedsObj
  }
}
