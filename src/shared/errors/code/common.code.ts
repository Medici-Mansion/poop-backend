import { generateResponse } from '@/shared/utils'

export enum CommonCode {
  OK = 'OK',
  CREATED = 'CREATED',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  CONFLICT = 'CONFLICT',
}

export const CommonCodes = {
  OK: generateResponse(200, 200, '성공'),
  CREATED: generateResponse(201, 201, '생성완료'),
  BAD_REQUEST: generateResponse(400, 400, '잘못된 요청'),
  CONFLICT: generateResponse(419, 419, '중복'),
  SERVER_ERROR: generateResponse(500, 500, '서버 에러'),
  NOT_FOUND: generateResponse(404, 404, '존재하지 않음'),
}
