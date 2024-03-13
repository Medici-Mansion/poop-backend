import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RefreshDTO {
  @ApiProperty({
    title: '재발급용 리프래시 토큰',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI4M2NkYjIxZC0xOWNjLTQ1ZmMtYTNlMi1jN2Y3ODlhZDlhMjQiLCJpYXQiOjE3MDk3MDYxNjIsImV4cCI6MTcxMjI5ODE2Mn0.wICUB_UrDGM1rQWezZC2ytA6V1quQqzpp3r62IjvZu0',
  })
  @IsString()
  refreshToken: string
}
