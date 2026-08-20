import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';

const app = express();

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
