import { Injectable, NotFoundException } from '@nestjs/common'
import { buildPaginator } from 'typeorm-cursor-pagination'

import { Breeds, SearchBreeds } from '@/breeds/models/breeds.model'

import { BaseService } from '@/shared/services/base.service'

import {
  GetBreadRequestDTO,
  GetBreedResponseDTO,
} from '@/breeds/dtos/get-breed.dto'
import { ResponseWithCursor } from '@/shared/dtos/common.dto'

@Injectable()
export class BreedsService {
  constructor(private readonly baseService: BaseService) {}

  async findById(id: string) {
    const repository = this.baseService.getManager().getRepository(Breeds)
    const foundBreeds = await repository.findOne({
      where: {
        id,
      },
    })

    if (!foundBreeds) throw new NotFoundException()
    return foundBreeds
  }

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
      paginationKeys: ['nameKR'],
      query: {
        limit: getBreadRequestDTO.limit,
        order: getBreadRequestDTO.order,
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
