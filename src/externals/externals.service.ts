import { Injectable } from '@nestjs/common'
import CoolsmsMessageService from 'coolsms-node-sdk'
@Injectable()
export class ExternalsService {
  private readonly coolsmsMessageService: CoolsmsMessageService
  constructor() {
    this.coolsmsMessageService = new CoolsmsMessageService(
      process.env.COOL_SMS_KEY,
      process.env.COOL_SMS_SECRET,
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
}
