import { PickType } from '@nestjs/swagger'
import { SearchBaseRequestDto } from './search-base-request.dto'

export class SearchDeleteRequestDto extends PickType(SearchBaseRequestDto, [
  'target',
  'id',
]) {}
