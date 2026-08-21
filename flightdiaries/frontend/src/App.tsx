import { useEffect, useState } from 'react'
import axios from 'axios'
import type { DiaryEntry, NewDiaryEntry, Visibility, Weather } from './types'

const baseUrl = 'http://localhost:3000/api/diaries'

const parseErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data as
      | { error?: Array<{ path?: string[]; message?: string }> }
      | undefined

    const firstError = errorData?.error?.[0]

    if (firstError) {
      const field = firstError.path?.[0] ?? 'field'
      const message = firstError.message ?? 'unknown error'
      const received = message.includes('received') ? message.split('received')[1]?.trim() : ''

      if (received) {
        return `Incorrect ${field}: ${received}`
      }

      return `Incorrect ${field}: ${message}`
    }

    if (typeof error.response?.data === 'string') {
      return error.response.data
    }

    return error.message
  }

  return 'Unknown error'
}

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState<Weather>('sunny')
  const [visibility, setVisibility] = useState<Visibility>('great')
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<DiaryEntry[]>(baseUrl)
      .then((response) => {
        setDiaries(response.data)
      })
      .catch((error) => {
        console.error('Error fetching diaries:', error)
      })
  }, [])

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setError(null)

    const newDiary: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment: comment || undefined
    }

    axios
      .post<DiaryEntry>(baseUrl, newDiary)
      .then((response) => {
        setDiaries(diaries.concat(response.data))
        setDate('')
        setWeather('sunny')
        setVisibility('great')
        setComment('')
      })
      .catch((err) => {
        setError(parseErrorMessage(err))
      })
  }

  return (
    <div>
      <h1>Add new entry</h1>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <form onSubmit={addDiary}>
        <div>
          <label htmlFor="date">date</label>
          <input id="date" value={date} onChange={({ target }) => setDate(target.value)} />
        </div>

        <div>
          <label htmlFor="visibility">visibility</label>
          <input
            id="visibility"
            value={visibility}
            onChange={({ target }) => setVisibility(target.value as Visibility)}
          />
        </div>

        <div>
          <label htmlFor="weather">weather</label>
          <input
            id="weather"
            value={weather}
            onChange={({ target }) => setWeather(target.value as Weather)}
          />
        </div>

        <div>
          <label htmlFor="comment">comment</label>
          <input id="comment" value={comment} onChange={({ target }) => setComment(target.value)} />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            <h3>{diary.date}</h3>
            <p>visibility: {diary.visibility}</p>
            <p>weather: {diary.weather}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
