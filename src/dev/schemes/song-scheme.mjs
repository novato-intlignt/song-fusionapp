import z from 'zod'

const songSchema = z.object({
  urlhost: z.string().url(),
  song: z.string({
    invalid_type_error: 'Name user must be a string'
  }),
  artist: z.string({
    invalid_type_error: 'Name user must be a string'
  })
})

export function validateSong (object) {
  return songSchema.safeParse(object)
}

export function validatePartialSong (object) {
  return songSchema.partial().safeParse(object)
}
