import { PickType } from '@nestjs/swagger'
import { SearchBaseRequestDto } from './search-base-request.dto'

export class SearchUpdateRequestDto extends PickType(SearchBaseRequestDto, [
  'target',
  'id',
]) {}
