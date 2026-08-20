import express, { type Response } from 'express';
import { z } from 'zod';
import { diagnoses } from './data/diagnoses.ts';
import { patients } from './data/patients.ts';
import { Gender, type Patient } from './data/patients.ts';

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

const isGender = (param: string): param is Gender => {
  return (Object.values(Gender) as string[]).includes(param);
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

app.post('/api/patients', (req, res) => {
  const NewPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.string(),
    ssn: z.string(),
    gender: z.string().refine((g) => isGender(g as string), { message: 'Invalid gender' }),
    occupation: z.string(),
  });

  try {
    const parsed = NewPatientSchema.parse(req.body);

    const newPatient: Patient = {
      id: generateId(),
      name: parsed.name,
      dateOfBirth: parsed.dateOfBirth,
      ssn: parsed.ssn,
      gender: parsed.gender as Gender,
      occupation: parsed.occupation,
    };

    patients.push(newPatient);
    res.json(newPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ error: error.issues });
    }
    return res.status(400).send({ error: 'malformatted request' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Patientor backend running on port ${PORT}`);
});
