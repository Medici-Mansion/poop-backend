import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import FormData from 'form-data'
import CoolsmsMessageService from 'coolsms-node-sdk'

import { EmailTemplateName } from '@/shared/constants/common.constants'

import { EmailVars } from '@/externals/interfaces/mail.interface'

@Injectable()
export class ExternalsService {
  private readonly coolsmsMessageService: CoolsmsMessageService =
    new CoolsmsMessageService(
      process.env.COOL_SMS_KEY,
      process.env.COOL_SMS_SECRET,
    )
  constructor(private readonly httpService: HttpService) {}

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
      `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
      form,
      {
        auth: {
          username: 'api',
          password: process.env.MAILGUN_API_KEY,
        },
      },
    )
    return response
  }
}
