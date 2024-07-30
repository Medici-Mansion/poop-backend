import { Inject, Injectable } from '@nestjs/common'
import { ES_API } from './es.constant'
import { AxiosInstance } from 'axios'
import { SearchIndexRequestDto } from './dtos/request/search-index-request.dto'
import { SearchIndexResponseDto } from './dtos/response/search-index-response.dto'
import { SearchUpdateRequestDto } from './dtos/request/search-update-request.dto'
import { ApiException } from '@/shared/exceptions/exception.interface'
import { SearchDeleteRequestDto } from './dtos/request/search-delete-request.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Direction } from '@/breeds/dtos/request/get-breed.dto'

type IndexTarget = 'poop-ranks' | 'poop-breeds' | 'poop-profiles'

enum OrderKey {
  CREATED_AT = 'createdAt',
  NAME_KR = 'nameKR',
  NAME_EN = 'nameEN',
}

class GetIndexDTO {
  @ApiProperty()
  target!: IndexTarget

  @ApiPropertyOptional()
  keyword?: string

  @ApiPropertyOptional()
  pageSize?: number

  @ApiPropertyOptional()
  page?: number

  @ApiPropertyOptional()
  sortKey?: OrderKey

  @ApiPropertyOptional({
    enum: Direction,
    description: 'Order direction',
    default: Direction.DESC,
  })
  order?: Direction
}

export interface GetIndexResponseDTO {
  statusCode: number
  message: string
  data: Data
  timestamp: string
  path: string
}

export interface Data {
  took: number
  page: number
  total: number
  totalPage: number
  list: List[]
}

export interface List {
  id: string
  createdAt: string
  updatedAt: string
  nameKR: string
  nameEN: string
  avatar: any
}

@Injectable()
export class EsService {
  constructor(@Inject(ES_API) private readonly esApi: AxiosInstance) {}

  async getIndex(getIndexDTO: GetIndexDTO) {
    const { keyword, order, page, pageSize, sortKey, target } = getIndexDTO
    const { data } = await this.esApi.get<GetIndexResponseDTO>('/search', {
      params: {
        target,
        keyword,
        pageSize,
        page,
        sort: sortKey && order ? `${sortKey}:${order}` : undefined,
      },
    })
    return data
  }

  async createIndex(
    searchIndexRequestDto: SearchIndexRequestDto,
  ): Promise<SearchIndexResponseDto | null> {
    try {
      const { data } = await this.esApi.post<SearchIndexResponseDto>(
        '/search',
        searchIndexRequestDto,
      )
      return data
    } catch (err) {
      return null
    }
  }

  async updateIndex(
    updateIndexRequestDto: SearchUpdateRequestDto & SearchIndexRequestDto,
  ): Promise<SearchIndexResponseDto | null> {
    try {
      const { id, target, targetData } = updateIndexRequestDto
      if (!id || !target) throw ApiException.PLAIN_BAD_REQUEST()
      const { data } = await this.esApi.put<SearchIndexResponseDto>(
        `/search/${updateIndexRequestDto.target}/${updateIndexRequestDto.id}`,
        targetData,
      )

      return data
    } catch {
      return null
    }
  }

  async deleteIndex(
    searchDeleteRequestDto: SearchDeleteRequestDto,
  ): Promise<boolean> {
    try {
      const { id, target } = searchDeleteRequestDto
      if (!id || !target) throw ApiException.PLAIN_BAD_REQUEST()
      const { data } = await this.esApi.delete(`/search/${target}/${id}`)
      return data
    } catch {
      return false
    }
  }
}
