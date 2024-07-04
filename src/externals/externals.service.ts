import { FatalLogRequestDTO } from './modules/influxdb/dtos/fatal-log-request.dto'
import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import FormData from 'form-data'
import { MemoryStoredFile } from 'nestjs-form-data'
import CoolsmsMessageService from 'coolsms-node-sdk'

import { BaseService } from '@/shared/services/base.service'
import { CloudinaryService } from '@/externals/modules/cloudinary/cloudinary.service'
import { AwsService } from '@/externals/modules/aws/aws.service'
import { InfluxDBService } from '@/externals/modules/influxdb/influxDB.service'

import { EmailVars } from '@/externals/interfaces/mail.interface'

import { LogRequestDTO } from '@/externals/modules/influxdb/dtos/log-request.dto'

import { EmailTemplateName } from '@/shared/constants/common.constant'
import { ApiException } from '@/shared/exceptions/exception.interface'

@Injectable()
export class ExternalsService {
  constructor(
    private readonly baseService: BaseService,
    private readonly httpService: HttpService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly influxDBService: InfluxDBService,
    private readonly awsService: AwsService,
    @Inject(CoolsmsMessageService)
    private readonly coolsmsMessageService: CoolsmsMessageService,
  ) {}

  /**
   * SMS전송
   * @param message 보낼 내용
   * @param to 보낼 번호 (수신 번호)
   * @param from 보내는 번호 (발신 번호)
   * @returns
   */
  async sendSMS(message: string, to: string, from: string = '010-9336-7663') {
    const sendResult = await this.coolsmsMessageService.sendOne({
      to,
      from,
      text: message,
      autoTypeDetect: false,
      type: 'SMS',
    })
    return sendResult
  }

  /**
   * 이메일 전송
   * @param subject
   * @param to
   * @param templateName
   * @param emailVars
   * @returns
   */
  async sendEmail(
    subject: string,
    to: string,
    templateName: EmailTemplateName,
    emailVars: EmailVars[],
  ) {
    const form = new FormData()
    form.append('from', 'PooP! <support@poop.co.kr>')
    form.append('to', to)
    form.append('subject', subject)
    form.append('template', templateName)
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value))
    const response = await this.httpService.axiosRef.post(
      `https://api.mailgun.net/v3/${this.baseService.conf.get('MAILGUN_DOMAIN')}/messages`,
      form,
      {
        auth: {
          username: 'api',
          password: this.baseService.conf.get('MAILGUN_API_KEY')!,
        },
      },
    )
    return response
  }

  async uploadFiles({
    files,
    folder = '',
    to = 'aws',
  }: {
    files: MemoryStoredFile[]
    folder?: string
    to?: 'aws' | 'cloudinary'
  }) {
    switch (to) {
      case 'aws':
        return this.awsService.uploadFiles(files, folder)
      case 'cloudinary':
        return this.cloudinaryService.uploadFiles(files, folder)
      default:
        throw ApiException.PLAIN_BAD_REQUEST('유효하지 않은 요청')
    }
  }

  async logResponse(logRequestDTO: LogRequestDTO) {
    return this.influxDBService.logRequest(logRequestDTO)
  }

  async fatalResponse(fatalLogRequestDTO: FatalLogRequestDTO) {
    return this.influxDBService.fatalRequest(fatalLogRequestDTO)
  }
}
