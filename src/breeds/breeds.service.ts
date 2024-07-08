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
      const curSearchKey = extractInitialConsonant(cur.nameKR || '')
      if (!curSearchKey) return acc
      if (!acc[curSearchKey]) {
        acc[curSearchKey] = []
      }

      acc[curSearchKey].push(new GetBreedResponseDTO(cur))
      return acc
    }, {})

    return breedsObj
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
