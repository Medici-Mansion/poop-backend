import { Injectable, NotFoundException } from '@nestjs/common'

import { GetBreedResponseDTO } from '@/breeds/dtos/get-breed.dto'

import { BreedsRepository } from '@/breeds/breeds.repository'
import { InsertObject, Selectable, ValueExpression, sql } from 'kysely'
import { DB } from '@/database/types'

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
  async createBreed(
    data: Partial<DB['breeds']>,
  ): Promise<Selectable<DB['breeds']>> {
    const breedData: InsertObject<DB, 'breeds'> = {
      ...data,
      id: sql`uuid_generate_v4()` as any,
      createdAt: sql`now()` as any,
      updatedAt: sql`now()` as any,
      deletedAt: data.deletedAt ? sql`${data.deletedAt}` : null,
    }

    return this.breedsRepository.create(breedData)
  }

  async updateBreed(
    id: string,
    data: Partial<Omit<DB['breeds'], 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Selectable<DB['breeds']>> {
    const updatedBreeds = await this.breedsRepository.update(id, {
      ...data,
      updatedAt: sql`now()` as any,
    })

    if (!updatedBreeds) throw new NotFoundException()

    return updatedBreeds
  }
}
