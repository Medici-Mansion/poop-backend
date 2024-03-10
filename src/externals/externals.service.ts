import { HttpService } from '@nestjs/axios'
import { Injectable, OnModuleInit } from '@nestjs/common'
import FormData from 'form-data'
import { MemoryStoredFile } from 'nestjs-form-data'
import CoolsmsMessageService from 'coolsms-node-sdk'

import { BaseService } from '@/shared/services/base.service'
import { CloudinaryService } from '@/externals/modules/cloudinary/cloudinary.service'
import { InfluxDBService } from '@/externals/modules/influxdb/influxDB.service'

import { EmailTemplateName } from '@/shared/constants/common.constants'

import { EmailVars } from '@/externals/interfaces/mail.interface'

import { LogRequestDTO } from '@/externals/modules/influxdb/dtos/log-request.dto'

@Injectable()
export class ExternalsService extends BaseService implements OnModuleInit {
  private coolsmsMessageService: CoolsmsMessageService

  constructor(
    private readonly httpService: HttpService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly influxDBService: InfluxDBService,
  ) {
    super()
  }
  onModuleInit() {
    this.coolsmsMessageService = new CoolsmsMessageService(
      this.configService.get('COOL_SMS_KEY'),
      this.configService.get('COOL_SMS_SECRET'),
    )
  }

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

  async sendEmail(
    subject: string,
    to: string,
    templateName: EmailTemplateName,
    emailVars: EmailVars[],
  ) {
    const form = new FormData()
    form.append('from', 'PooP! <support@poop.com>')
    form.append('to', to)
    form.append('subject', subject)
    form.append('template', templateName)
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value))
    const response = await this.httpService.axiosRef.post(
      `https://api.mailgun.net/v3/${this.configService.get('MAILGUN_DOMAIN')}/messages`,
      form,
      {
        auth: {
          username: 'api',
          password: this.configService.get('MAILGUN_API_KEY'),
        },
      },
    )
    return response
  }

  async uploadFiles(files: MemoryStoredFile[], folder: string = '') {
    return this.cloudinaryService.uploadFiles(files, folder)
  }

  async logResponse(logRequestDTO: LogRequestDTO) {
    return this.influxDBService.logRequest(logRequestDTO)
  }
}
