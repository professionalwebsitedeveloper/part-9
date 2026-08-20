import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  if (!height || !weight) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const h = Number(height);
  const w = Number(weight);

  if (isNaN(h) || isNaN(w)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(h, w);

  return res.json({ weight: w, height: h, bmi });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = req.body;
  if (!body || body.daily_exercises === undefined || body.target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  const daily = body.daily_exercises;
  const target = body.target;

  if (!Array.isArray(daily) || isNaN(Number(target)) || daily.some((d: any) => isNaN(Number(d)))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const dailyNums = daily.map((d: any) => Number(d));
  const result = calculateExercises(dailyNums, Number(target));
  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
