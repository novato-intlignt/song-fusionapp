import { createApp } from './app.mjs'

import { UserModel } from './dev/models/user.mjs'
import { EmailService } from './dev/services/verify-email.mjs'
import { SongService } from './dev/services/song.mjs'
import { SongModel } from './dev/models/song.mjs'
createApp({
  userModel: UserModel,
  emailService: EmailService,
  songService: SongService,
  songModel: SongModel
})
