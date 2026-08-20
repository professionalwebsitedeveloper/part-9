import express from 'express';
import type { Request, Response } from 'express';
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

app.post('/exercises', (req: Request, res: Response) => {
  const body: unknown = req.body;

  if (typeof body !== 'object' || body === null) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  const record = body as Record<string, unknown>;

  if (!('daily_exercises' in record) || !('target' in record)) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  const daily = record.daily_exercises;
  const target = record.target;

  if (!Array.isArray(daily) || (typeof target !== 'number' && typeof target !== 'string')) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const dailyValid = daily.every((d) => typeof d === 'number' || (typeof d === 'string' && !isNaN(Number(d))));
  const targetValid = typeof target === 'number' || (typeof target === 'string' && !isNaN(Number(target)));

  if (!dailyValid || !targetValid) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const dailyNums = daily.map((d) => Number(d));
  const result = calculateExercises(dailyNums, Number(target));
  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
