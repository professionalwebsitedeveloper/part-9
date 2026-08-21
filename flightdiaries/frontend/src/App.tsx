import { useEffect, useState } from 'react'
import axios from 'axios'
import type { DiaryEntry } from './types'

const baseUrl = 'http://localhost:3000/api/diaries'

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])

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

  return (
    <div>
      <h1>Flight Diaries</h1>
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
