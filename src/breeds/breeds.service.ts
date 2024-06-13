import { Injectable, NotFoundException } from '@nestjs/common'

import { GetBreedResponseDTO } from '@/breeds/dtos/get-breed.dto'

import { BreedsRepository } from '@/breeds/breeds.repository'

@Injectable()
export class BreedsService {
  constructor(private readonly breedsRepository: BreedsRepository) {}

  async findById(id: string) {
    const foundBreeds = await this.breedsRepository.findOne(id)

    if (!foundBreeds) throw new NotFoundException()

    return foundBreeds
  }

  async getAllBreeds() {
    const allBreeds = await this.breedsRepository.findAllBreeds()

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
