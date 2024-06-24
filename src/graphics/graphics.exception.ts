import { ApiException } from '@/shared/exceptions/exception.interface'
import { IPoopError } from '@/shared/errors/error.interface'

import { generateResponse } from '@/shared/utils'

export enum GraphicsCode {
  NOTFOUND = 'GRAPHICS:NOTFOUND',
}

/**
 * Graphics 에러코드
 * 9000 ~ 9100
 * 9000 존재하지 않는 그래픽 요소
 */
export const GraphicsCodes = {
  [GraphicsCode.NOTFOUND]: generateResponse(
    400,
    9000,
    '존재하지 않는 그래픽 요소',
  ),
}

export class GraphicsException extends ApiException {
  constructor(poopError: IPoopError) {
    super(poopError)
  }

  static get NOTFOUND() {
    return new GraphicsException(GraphicsCodes[GraphicsCode.NOTFOUND]())
  }
}
