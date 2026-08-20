import express, { type Response } from 'express';
import { diagnoses } from './data/diagnoses.ts';
import { patients } from './data/patients.ts';
import type { Patient, Gender } from './data/patients.ts';

type NonSensitivePatient = Omit<Patient, 'ssn'>;

const app = express();
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.json(diagnoses);
});

// return patients without ssn for list
app.get('/api/patients', (_req, res: Response<NonSensitivePatient[]>) => {
  const sanitized: NonSensitivePatient[] = patients.map((p) => ({
    id: p.id,
    name: p.name,
    dateOfBirth: p.dateOfBirth,
    gender: p.gender,
    occupation: p.occupation,
  }));
  res.json(sanitized);
});

function isGender(g: unknown): g is Gender {
  return g === 'male' || g === 'female' || g === 'other';
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

app.post('/api/patients', (req, res) => {
  const body: unknown = req.body;
  if (typeof body !== 'object' || body === null) {
    return res.status(400).send({ error: 'malformatted request' });
  }

  const rec = body as Record<string, unknown>;
  const name = rec.name as string | undefined;
  const dateOfBirth = rec.dateOfBirth as string | undefined;
  const ssn = rec.ssn as string | undefined;
  const gender = rec.gender;
  const occupation = rec.occupation as string | undefined;

  if (!name || !dateOfBirth || !ssn || !occupation || !isGender(gender)) {
    return res.status(400).send({ error: 'missing or invalid fields' });
  }

  const newPatient: Patient = {
    id: generateId(),
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
  };

  patients.push(newPatient);
  res.json(newPatient);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Patientor backend running on port ${PORT}`);
});
