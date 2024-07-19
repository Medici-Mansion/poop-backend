import { Api } from '@/shared/dtos/api.dto'
import { Result } from '@/shared/dtos/result.dto'
import { IPoopError, TPoopError } from '@/shared/errors/error.interface'
import { Type, applyDecorators } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiPropertyOptions,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

// 스웨거 메타데이터 키
const DECORATORS_PREFIX = 'swagger'
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`

// source form lodash
function isObject(value: unknown) {
  const type = typeof value
  return value != null && (type == 'object' || type == 'function')
}

// 기본생성자 함수
function isFunction(value: unknown): boolean {
  if (!isObject(value)) {
    return false
  }
  return true
}

// () => type 형태의 순환참조로 기술했을때 가져오는 함수
function isLazyTypeFunc(type: Type<unknown>): boolean {
  return isFunction(type) && type.name === 'type'
}

// 원시타입인지 확인
function isPrimitiveType(
  type:
    | string
    | [Type<unknown>]
    | Type<unknown>
    | Record<string, any>
    | undefined,
): boolean {
  return (
    typeof type === 'function' &&
    [String, Boolean, Number].some((item) => item === type)
  )
}

// Type 인지 확인하는 커스텀 타입 체커
function checkType(object: any): object is Type {
  return object
}

type ApiPropertyOptionsWithFieldName = ApiPropertyOptions & {
  fieldName: string
}

export function makeInstanceByApiProperty<T>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  dtoClass: Type<unknown> | Function | [Function],
  // eslint-disable-next-line @typescript-eslint/ban-types
  generic?: Type<unknown> | Function | [Function],
): T | T[] {
  // 디티오로 생성자를 만들지 않고 해당 타입만 가져옴.
  // 생성자에 인자가 들어간경우 에러가 남.
  const mappingDto = Array.isArray(dtoClass) ? [] : {}

  if (Array.isArray(dtoClass)) {
    return dtoClass.map((dto) => {
      const resultDto = {}
      const propertiesArray: string[] =
        Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dto.prototype) || []

      // apiProperty로 적었던 필드명 하나하나의 정보를 가져오기 위함
      const properties: ApiPropertyOptionsWithFieldName[] = propertiesArray.map(
        (field) => {
          // :fieldName 형식이라서 앞에 : 를 짤라줌
          const fieldName = field.substring(1)
          // 각 필드마다 메타데이터를 가져옴
          const obj = Reflect.getMetadata(
            API_MODEL_PROPERTIES,
            dto.prototype,
            fieldName,
          )
          obj.fieldName = fieldName
          return obj
        },
      )

      //  mappingDto 를 만듬
      for (const property of properties) {
        const propertyType = property.type

        // property.type apiproperty에 type 을 기술 않할 수 있으므로 undefiend 체크
        if (propertyType) {
          // 이건 커스텀임 generic을 위한 커스텀
          // dto에 T 제네릭으로 들어가는게 있다면 type을 generic 으로 적어주세요
          if (propertyType === 'generic') {
            // generic으로 만들 추가적인 타입이 있다면
            if (generic) {
              if (property.isArray) {
                resultDto[property.fieldName] = [
                  makeInstanceByApiProperty(generic),
                ]
              } else {
                resultDto[property.fieldName] =
                  makeInstanceByApiProperty(generic)
              }
            }
          } else if (propertyType === 'string') {
            // 스트링 형태의 enum
            if (typeof property.example !== 'undefined') {
              resultDto[property.fieldName] = property.example
            } else {
              resultDto[property.fieldName] = property.description
            }
          } else if (propertyType === 'number') {
            // 숫자형태의 enum
            if (typeof property.example !== 'undefined') {
              resultDto[property.fieldName] = property.example
            } else {
              resultDto[property.fieldName] = property.description
            }
          } else if (isPrimitiveType(propertyType)) {
            // 원시타입 [String, Boolean, Number]

            if (typeof property.example !== 'undefined') {
              resultDto[property.fieldName] = property.example
            } else {
              resultDto[property.fieldName] = property.description
            }
          } else if (isLazyTypeFunc(propertyType as Type<unknown>)) {
            // type: () => PageMetaDto  형태의 lazy
            // 익명함수를 실행시켜 안에 Dto 타입을 가져옵니다.

            const constructorType = (propertyType as () => Type<unknown>)()

            if (Array.isArray(constructorType)) {
              resultDto[property.fieldName] = [
                makeInstanceByApiProperty(constructorType[0]),
              ]
            } else if (property.isArray) {
              resultDto[property.fieldName] = [
                makeInstanceByApiProperty(constructorType),
              ]
            } else {
              resultDto[property.fieldName] =
                makeInstanceByApiProperty(constructorType)
            }
          } else if (checkType(propertyType)) {
            //마지막 정상적인 클래스 형태의 타입
            if (property.isArray) {
              resultDto[property.fieldName] = [
                makeInstanceByApiProperty(propertyType),
              ]
            } else {
              resultDto[property.fieldName] =
                makeInstanceByApiProperty(propertyType)
            }
          }
        }
      }

      return resultDto as T
    })
  }

  // metadata 에서 apiProperty로 저장했던 필드명들을 불러옴
  const propertiesArray: string[] =
    Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dtoClass.prototype) || []

  // apiProperty로 적었던 필드명 하나하나의 정보를 가져오기 위함
  const properties: ApiPropertyOptionsWithFieldName[] = propertiesArray.map(
    (field) => {
      // :fieldName 형식이라서 앞에 : 를 짤라줌
      const fieldName = field.substring(1)
      // 각 필드마다 메타데이터를 가져옴
      const obj = Reflect.getMetadata(
        API_MODEL_PROPERTIES,
        dtoClass.prototype,
        fieldName,
      )
      obj.fieldName = fieldName
      return obj
    },
  )

  //  mappingDto 를 만듬
  for (const property of properties) {
    const propertyType = property.type

    // property.type apiproperty에 type 을 기술 않할 수 있으므로 undefiend 체크
    if (propertyType) {
      // 이건 커스텀임 generic을 위한 커스텀
      // dto에 T 제네릭으로 들어가는게 있다면 type을 generic 으로 적어주세요
      if (propertyType === 'generic') {
        // generic으로 만들 추가적인 타입이 있다면
        if (generic) {
          if (property.isArray) {
            mappingDto[property.fieldName] = [
              makeInstanceByApiProperty(generic),
            ]
          } else {
            mappingDto[property.fieldName] = makeInstanceByApiProperty(generic)
          }
        }
      } else if (propertyType === 'string') {
        // 스트링 형태의 enum
        if (typeof property.example !== 'undefined') {
          mappingDto[property.fieldName] = property.example
        } else {
          mappingDto[property.fieldName] = property.description
        }
      } else if (propertyType === 'number') {
        // 숫자형태의 enum
        if (typeof property.example !== 'undefined') {
          mappingDto[property.fieldName] = property.example
        } else {
          mappingDto[property.fieldName] = property.description
        }
      } else if (isPrimitiveType(propertyType)) {
        // 원시타입 [String, Boolean, Number]

        if (typeof property.example !== 'undefined') {
          mappingDto[property.fieldName] = property.example
        } else {
          mappingDto[property.fieldName] = property.description
        }
      } else if (isLazyTypeFunc(propertyType as Type<unknown>)) {
        // type: () => PageMetaDto  형태의 lazy
        // 익명함수를 실행시켜 안에 Dto 타입을 가져옵니다.

        const constructorType = (propertyType as () => Type<unknown>)()

        if (Array.isArray(constructorType)) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(constructorType[0]),
          ]
        } else if (property.isArray) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(constructorType),
          ]
        } else {
          mappingDto[property.fieldName] =
            makeInstanceByApiProperty(constructorType)
        }
      } else if (checkType(propertyType)) {
        //마지막 정상적인 클래스 형태의 타입
        if (property.isArray) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(propertyType),
          ]
        } else {
          mappingDto[property.fieldName] =
            makeInstanceByApiProperty(propertyType)
        }
      }
    }
  }

  return mappingDto as T
}

interface SuccessResponseOption {
  /**
   * 응답 DTO를 인자로받습니다
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  model: Type<unknown> | Function | [Function]
  /**
   * 예시의 제목을 적습니다
   */
  exampleTitle: string

  /**
   * result 응답 객체
   */
  result?: IPoopError

  /**
   * 어떠한 상황일 때 예시형태의 응답값을 주는지 기술 합니다.
   */
  exampleDescription: string
  /**
   * 제네릭 형태가 필요할 때 기술합니다.
   */
  generic?: Type<any>

  custom?: SchemaObject | ReferenceObject
}

export const ApiResult = (
  poopError: TPoopError,
  succesResponseOptions: SuccessResponseOption[],
) => {
  const defaultResult =
    typeof poopError === 'function' ? poopError() : poopError
  const examples = succesResponseOptions
    .map((response: SuccessResponseOption) => {
      // base CommonResponse 를 만듭니다.
      if (response.custom) {
        return {
          [response.exampleTitle]: {
            value: response.custom,
            description: response.exampleDescription,
          },
        }
      }
      const commonResponseInstance = makeInstanceByApiProperty<Api<any>>(
        Api,
        response.model,
      ) as Api<any>
      const DtoModel = response.model

      // dto 객체를 만든다. 제네릭은 옵셔널 한 값이라 없으면 없는대로 만든다.
      const dtoData = makeInstanceByApiProperty<typeof DtoModel>(DtoModel)

      const result = response.result || defaultResult
      commonResponseInstance.body = dtoData
      commonResponseInstance.result = new Result(
        result.getErrorCode(),
        result.getDescription(),
      )

      // 예시 정보를 만든다 ( 스웨거의 examplse)
      return {
        [response.exampleTitle]: {
          value: commonResponseInstance,
          description: response.exampleDescription,
        },
      }
    })
    .reduce(function (result, item) {
      Object.assign(result, item)
      return result
    }, {}) // null 값 있을경우 필터링

  // 스키마를 정의 내리기 위한 함수들
  const extraModel = succesResponseOptions.map((e) => {
    return e.model
  }) as unknown as Type[]
  // 중복값 제거
  const setOfExtraModel = new Set(extraModel)

  // $ref 추가
  const pathsOfDto = [...setOfExtraModel].map((e) => {
    return { $ref: getSchemaPath(e) }
  })
  // 제네릭 관련
  const extraGeneric = succesResponseOptions
    .map((e) => {
      return e.generic
    })
    .filter((e) => e) as unknown as Type[]
  const pathsOfGeneric = extraGeneric.map((e) => {
    return { $ref: getSchemaPath(e) }
  })

  // 데코레이터를 만든다.
  return applyDecorators(
    // $ref를 사용하기 위해선 extraModel 로 등록 시켜야한다.
    ApiExtraModels(...extraModel, ...extraGeneric, Api),
    ApiResponse({
      status: defaultResult.getHttpStatusCode(),
      content: {
        'application/json': {
          schema: {
            // 베이스 스키마
            additionalProperties: {
              $ref: getSchemaPath(Api),
            },
            // dto 스키마들
            oneOf: [...pathsOfDto, ...pathsOfGeneric],
          },
          // 예시값
          examples: examples,
        },
      },
    }),
  )
}
