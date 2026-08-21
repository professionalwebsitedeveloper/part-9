import { useEffect, useState } from 'react'
import axios from 'axios'
import type { DiaryEntry, NewDiaryEntry, Visibility, Weather } from './types'

const baseUrl = 'http://localhost:3000/api/diaries'

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState<Weather>('sunny')
  const [visibility, setVisibility] = useState<Visibility>('great')
  const [comment, setComment] = useState('')

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
      .catch((error) => {
        console.error('Error adding diary:', error)
      })
  }

  return (
    <div>
      <h1>Flight Diaries</h1>

      <form onSubmit={addDiary}>
        <div>
          <label htmlFor="date">Date:</label>
          <input id="date" value={date} onChange={({ target }) => setDate(target.value)} />
        </div>

        <div>
          <label htmlFor="weather">Weather:</label>
          <select
            id="weather"
            value={weather}
            onChange={({ target }) => setWeather(target.value as Weather)}
          >
            <option value="sunny">sunny</option>
            <option value="rainy">rainy</option>
            <option value="cloudy">cloudy</option>
            <option value="stormy">stormy</option>
            <option value="windy">windy</option>
          </select>
        </div>

        <div>
          <label htmlFor="visibility">Visibility:</label>
          <select
            id="visibility"
            value={visibility}
            onChange={({ target }) => setVisibility(target.value as Visibility)}
          >
            <option value="great">great</option>
            <option value="good">good</option>
            <option value="ok">ok</option>
            <option value="poor">poor</option>
          </select>
        </div>

        <div>
          <label htmlFor="comment">Comment:</label>
          <input
            id="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>

        <button type="submit">add</button>
      </form>

      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            <h2>{diary.date}</h2>
            <p>
              <strong>Weather:</strong> {diary.weather}
            </p>
            <p>
              <strong>Visibility:</strong> {diary.visibility}
            </p>
            {diary.comment && <p>{diary.comment}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
