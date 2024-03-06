import { Controller } from '@nestjs/common'
import { ProfilesService } from '@/profiles/profiles.service'

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
}
