import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, { data: T }> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ data: T }> {
    return next.handle().pipe(map((data) => ({ data, error: null })))
  }
}

// catchError((error) => {
//   console.log(error)
//   if (error instanceof HttpException) {
//     return throwError(
//       () =>
//         new HttpException(
//           {
//             data: null,
//             error: {
//               statusCode: error.getStatus(),
//               message: error.getResponse(),
//             },
//           },
//           error.getStatus(),
//         ),
//     )
//   } else {
//     // 알 수 없는 에러 처리
//     return throwError(
//       () =>
//         new HttpException(
//           {
//             data: null,
//             error: {
//               statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//               message: 'Internal server error',
//             },
//           },
//           HttpStatus.INTERNAL_SERVER_ERROR,
//         ),
//     )
//   }
// })
