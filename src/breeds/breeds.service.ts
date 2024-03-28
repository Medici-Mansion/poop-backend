import { Injectable } from '@nestjs/common'
import { buildPaginator } from 'typeorm-cursor-pagination'

import { BaseService } from '@/shared/services/base.service'

import { SearchBreeds } from '@/breeds/models/breeds.model'

import {
  GetBreadRequestDTO,
  GetBreedResponseDTO,
} from '@/breeds/dtos/get-breed.dto'
import { ResponseWithCursor } from '@/shared/dtos/common.dto'

@Injectable()
export class BreedsService {
  constructor(private readonly baseService: BaseService) {}

  async getBreedsWithCursor(getBreadRequestDTO: GetBreadRequestDTO) {
    const queryBuilder = this.baseService
      .getManager()
      .createQueryBuilder(SearchBreeds, 'b')

    if (getBreadRequestDTO.searchKey) {
      queryBuilder.where(`b.searchKey = :searchKey`, {
        searchKey: getBreadRequestDTO.searchKey,
      })
    }
    const paginator = buildPaginator({
      entity: SearchBreeds,
      alias: 'b',
      paginationKeys: ['id'],
      query: {
        limit: 10,
        order: 'ASC',
      },
    })

    const { data, cursor } = await paginator.paginate(queryBuilder)

    return new ResponseWithCursor(
      data.map((item) => new GetBreedResponseDTO(item)),
      cursor,
    )
  }
}
