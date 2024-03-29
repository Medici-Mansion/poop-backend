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
      queryBuilder.where(`b.searchKeyCode = :searchKeyCode`, {
        searchKeyCode: getBreadRequestDTO.searchKey.charCodeAt(0),
      })
    }

    const paginator = buildPaginator({
      entity: SearchBreeds,
      alias: 'b',
      paginationKeys: ['name'],
      query: {
        limit: getBreadRequestDTO.limit,
        order: 'ASC',
        ...(getBreadRequestDTO.cursor && {
          afterCursor: getBreadRequestDTO.cursor,
        }),
      },
    })

    const { data, cursor } = await paginator.paginate(queryBuilder)

    return new ResponseWithCursor(
      data.map((item) => new GetBreedResponseDTO(item)),
      cursor,
    )
  }
}
