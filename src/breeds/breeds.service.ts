import { DataSourceService } from '@/prisma/datasource.service'
import { Injectable, NotFoundException } from '@nestjs/common'

import { GetBreedResponseDTO } from '@/breeds/dtos/get-breed.dto'

@Injectable()
export class BreedsService {
  constructor(private readonly dataSourceService: DataSourceService) {}

  async findById(id: string) {
    const foundBreeds = await this.dataSourceService.manager.breed.findUnique({
      where: {
        id,
      },
    })
    if (!foundBreeds) throw new NotFoundException()
    return foundBreeds
  }

  async getAllBreeds() {
    const allBreeds =
      await this.dataSourceService.manager.searchBreeds.findMany({
        orderBy: {
          nameKR: 'asc',
        },
      })

    const breedsObj = allBreeds.reduce((acc, cur) => {
      if (!cur.searchKey) return acc
      if (!acc[cur.searchKey]) {
        acc[cur.searchKey] = []
      }

      acc[cur.searchKey].push(new GetBreedResponseDTO(cur))
      return acc
    }, {})

    return breedsObj
  }
}
