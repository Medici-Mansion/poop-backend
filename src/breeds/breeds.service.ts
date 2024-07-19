import { Injectable, NotFoundException } from '@nestjs/common'

import { GetBreedResponseDTO } from '@/breeds/dtos/request/get-breed.dto'

import { BreedsRepository } from '@/breeds/breeds.repository'
import { ExternalsService } from '@/externals/externals.service'
import { CreateBreedDTO } from './dtos/request/create-breed.dto'
import { UpdateBreedDTO } from './dtos/request/update-breed.dto'
import { UpdateBreedResponseDTO } from './dtos/response/update-breed-response.dto'
import { Transactional } from '@nestjs-cls/transactional'
import { RemoveBreedsDTO } from './dtos/request/remove-breeds.dto'

@Injectable()
export class BreedsService {
  constructor(
    private readonly breedsRepository: BreedsRepository,
    private readonly externalsService: ExternalsService,
  ) {}

  async findById(id: string): Promise<GetBreedResponseDTO> {
    const foundBreeds = await this.breedsRepository.findOne(id)

    if (!foundBreeds) throw new NotFoundException()

    return new GetBreedResponseDTO(foundBreeds)
  }

  async getAllBreeds() {
    const allBreeds = await this.breedsRepository.findAllBreeds()

    const breedsObj = allBreeds.reduce((acc, cur) => {
      const curSearchKey = extractInitialConsonant(cur.nameKR || '')
      if (!curSearchKey) return acc
      if (!acc[curSearchKey]) {
        acc[curSearchKey] = []
      }

      acc[curSearchKey].push(new GetBreedResponseDTO(cur))
      return acc
    }, {})

    return breedsObj as { [key: string]: GetBreedResponseDTO[] }
  }

  /**
   * 견종 생성하기
   * @param createBreedDTO
   * @returns
   */
  @Transactional()
  async createBreed(createBreedDTO: CreateBreedDTO): Promise<boolean> {
    const avatarUrl = await this.externalsService.uploadFiles({
      files: [createBreedDTO.avatar],
      folder: 'breed',
    })
    const createBreed = await this.breedsRepository.create({
      nameKR: createBreedDTO.nameEN,
      nameEN: createBreedDTO.nameEN,
      avatar: avatarUrl[0],
    })

    return !!createBreed
  }

  /**
   * 견종 수정하기
   * @param updateBreedDTO
   * @returns
   */
  @Transactional()
  async updateBreed(
    updateBreedDTO: UpdateBreedDTO,
  ): Promise<UpdateBreedResponseDTO> {
    /**
     * 존재하는 견조 여부 확인
     */
    const foundBreed = await this.findById(updateBreedDTO.id)

    let avatarUrl = foundBreed.avatar
    const { file, ...dto } = updateBreedDTO
    if (file) {
      const uploadResponse = await this.externalsService.uploadFiles({
        files: [file],
        folder: 'breed',
      })
      avatarUrl = uploadResponse[0]
    }

    const updatedBreed = await this.breedsRepository.update({
      ...dto,
      avatar: avatarUrl,
    })

    return new UpdateBreedResponseDTO(updatedBreed)
  }

  @Transactional()
  async removeBreeds(removeBreedsDTO: RemoveBreedsDTO) {
    const response = await this.breedsRepository.removeMany(removeBreedsDTO.ids)
    return !!response
  }
}

function extractInitialConsonant(text: string): string | null {
  const HANGUL_SYLLABLES_START = 0xac00
  const HANGUL_SYLLABLES_END = 0xd7a3

  // 초성 리스트
  const CHO_SUNG_LIST = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ]

  if (!text) {
    return null
  }

  const firstChar = text[0]

  // 첫 글자가 한글인지 확인
  const firstCharCode = firstChar.charCodeAt(0)
  if (
    HANGUL_SYLLABLES_START <= firstCharCode &&
    firstCharCode <= HANGUL_SYLLABLES_END
  ) {
    const unicodeOffset = firstCharCode - HANGUL_SYLLABLES_START
    const choSungIndex = Math.floor(unicodeOffset / (21 * 28))
    return CHO_SUNG_LIST[choSungIndex]
  } else {
    return null
  }
}
