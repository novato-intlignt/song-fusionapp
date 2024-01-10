import axios from 'axios'
import z from 'zod'
import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config()
const songSchema = z.object({
  urlhost: z.string().url(),
  song: z.string({
    invalid_type_error: 'Name user must be a string'
  }),
  artist: z.string({
    invalid_type_error: 'Name user must be a string'
  })
})

export async function songData (id) {
  const apiKey = process.env.GENIUS_API_KEY
  const apiUrl = `https://api.genius.com/songs/${id}?access_token=${apiKey}`

  const res = await axios.get(apiUrl)
  const searchData = res.data.response.song
  return searchData
}

export async function songLyrics (id) {
  const optionsRapidApi = {
    method: 'GET',
    url: 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/',
    params: {
      id: `${id}`,
      text_format: 'plain'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.RAPID_API_HOST
    }
  }
  const resRapidApi = await axios.request(optionsRapidApi)
  const lines = resRapidApi.data.lyrics.lyrics.body.plain
  const lyrics = lines.split('\n').filter(line => !/^\[/.test(line.trim())).join('\n')
  const getLyrics = correctAbbreviations(lyrics)

  return getLyrics
}

export async function lyricTranslate (lyrics) {
  const apiKey = process.env.OPENAI_API_KEY
  const openAi = new OpenAI(apiKey)
  const completion = await openAi.chat.completions.create({
    messages: [{ role: 'user', content: `Translate the following English text to Spanish: '${lyrics}'` }],
    model: 'gpt-3.5-turbo-1106'
  })
  const lines = completion.choices[0].message.content
  const lyricTranslated = lines.split('\n').join('\n')
  return lyricTranslated
}

function correctAbbreviations (text) {
  const regex = /\b(\w+)'(?=,|\s|$)/g

  function replaceAbbreviations (match, word) {
    return word + 'g'
  }

  const correctedText = text.replace(regex, replaceAbbreviations)

  return correctedText
}

export function validateSong (object) {
  return songSchema.safeParse(object)
}

export function validatePartialSong (object) {
  return songSchema.partial().safeParse(object)
}
