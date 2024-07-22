import { EsService } from './../externals/modules/es/es.service'
import { Injectable, NotFoundException } from '@nestjs/common'

import {
  GetBreedResponseDTO,
  OrderBreedDTO,
} from '@/breeds/dtos/request/get-breed.dto'

import { BreedsRepository } from '@/breeds/breeds.repository'
import { ExternalsService } from '@/externals/externals.service'
import { CreateBreedDTO } from './dtos/request/create-breed.dto'
import { UpdateBreedDTO } from './dtos/request/update-breed.dto'
import { UpdateBreedResponseDTO } from './dtos/response/update-breed-response.dto'
import { Transactional } from '@nestjs-cls/transactional'
import { RemoveBreedsDTO } from './dtos/request/remove-breeds.dto'
import dayjs from 'dayjs'

@Injectable()
export class BreedsService {
  constructor(
    private readonly breedsRepository: BreedsRepository,
    private readonly externalsService: ExternalsService,
    private readonly esService: EsService,
  ) {}

  async findById(id: string): Promise<GetBreedResponseDTO> {
    const foundBreeds = await this.breedsRepository.findOne(id)

    if (!foundBreeds) throw new NotFoundException()

    return new GetBreedResponseDTO(foundBreeds)
  }

  async getAllBreeds(orderBreedDTO: OrderBreedDTO) {
    const { rows: allBreeds } =
      await this.breedsRepository.findAllBreeds(orderBreedDTO)
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
      nameKR: createBreedDTO.nameKR,
      nameEN: createBreedDTO.nameEN,
      avatar: avatarUrl[0],
    })
    if (createBreed) {
      await this.esService.createIndex({
        target: 'poop-breeds',
        targetData: {
          ...createBreed,
          nameKR: createBreed?.nameKR || '',
          nameEN: createBreed.nameEN || '',
          avatar: createBreed.avatar || '',
          createdAt: dayjs(createBreed.createdAt).format(),
          updatedAt: dayjs(createBreed.updatedAt).format(),
          ['@timestamp']: dayjs().format(),
        },
      })
    }
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

    await this.esService.updateIndex({
      target: 'poop-breeds',
      id: updatedBreed.id,
      targetData: {
        ...updatedBreed,
        ['@timestamp']: dayjs().format(),
        nameKR: updatedBreed?.nameKR || '',
        nameEN: updatedBreed.nameEN || '',
        avatar: updatedBreed.avatar || '',
        createdAt: dayjs(updatedBreed.createdAt).format(),
        updatedAt: dayjs(updatedBreed.updatedAt).format(),
      },
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

  // 숫자와 알파벳에 대한 한글 초성 매핑
  const NUMBER_TO_HANGUL_INITIAL = {
    '1': 'ㅇ',
    '2': 'ㅇ',
    '3': 'ㅅ',
    '4': 'ㅇ',
    '5': 'ㅇ',
    '6': 'ㅇ',
    '7': 'ㅊ',
    '8': 'ㅍ',
    '9': 'ㄱ',
    '0': 'ㅇ',
  }

  const ALPHABET_TO_HANGUL_INITIAL = {
    a: 'ㅇ',
    b: 'ㅂ',
    c: 'ㅅ',
    d: 'ㄷ',
    e: 'ㅇ',
    f: 'ㅍ',
    g: 'ㄱ',
    h: 'ㅎ',
    i: 'ㅇ',
    j: 'ㅈ',
    k: 'ㅋ',
    l: 'ㄹ',
    m: 'ㅁ',
    n: 'ㄴ',
    o: 'ㅇ',
    p: 'ㅍ',
    q: 'ㅋ',
    r: 'ㄹ',
    s: 'ㅅ',
    t: 'ㅌ',
    u: 'ㅇ',
    v: 'ㅂ',
    w: 'ㅇ',
    x: 'ㅅ',
    y: 'ㅇ',
    z: 'ㅈ',
  }

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
  } else if (NUMBER_TO_HANGUL_INITIAL[firstChar]) {
    // 첫 글자가 숫자인 경우
    return NUMBER_TO_HANGUL_INITIAL[firstChar]
  } else if (ALPHABET_TO_HANGUL_INITIAL[firstChar.toLowerCase()]) {
    // 첫 글자가 알파벳인 경우
    return ALPHABET_TO_HANGUL_INITIAL[firstChar.toLowerCase()]
  } else {
    return firstChar // 그 외의 경우 원본 그대로 리턴
  }
}
