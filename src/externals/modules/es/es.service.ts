import { Inject, Injectable } from '@nestjs/common'
import { ES_API } from './es.constant'
import { AxiosInstance } from 'axios'
import { SearchIndexRequestDto } from './dtos/request/search-index-request.dto'
import { SearchIndexResponseDto } from './dtos/response/search-index-response.dto'
import { SearchUpdateRequestDto } from './dtos/request/search-update-request.dto'
import { ApiException } from '@/shared/exceptions/exception.interface'
import { SearchDeleteRequestDto } from './dtos/request/search-delete-request.dto'

@Injectable()
export class EsService {
  constructor(@Inject(ES_API) private readonly esApi: AxiosInstance) {}

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
