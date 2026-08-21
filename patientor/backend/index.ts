import express, { type Response, type Request } from 'express';
import NewPatientSchema, { newPatientParser, errorMiddleware, type NewPatient } from './utils.ts';
import { diagnoses } from './data/diagnoses.ts';
import { patients } from './data/patients.ts';
import { Gender, type Patient } from './data/patients.ts';

type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

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

app.get('/api/patients/:id', (req, res: Response<Patient | { error: string }>) => {
  const patient = patients.find((p) => p.id === req.params.id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  return res.json(patient);
});

const isGender = (param: string): param is Gender => {
  return (Object.values(Gender) as string[]).includes(param);
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

app.post('/api/patients', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res) => {
  const parsed = NewPatientSchema.parse(req.body);

  if (!isGender(parsed.gender)) {
    return res.status(400).send({ error: 'Invalid gender' });
  }

  const newPatient: Patient = {
    id: generateId(),
    name: parsed.name,
    dateOfBirth: parsed.dateOfBirth,
    ssn: parsed.ssn,
    gender: parsed.gender,
    occupation: parsed.occupation,
    entries: [],
  };

  patients.push(newPatient);
  return res.json(newPatient);
});

// error handling middleware for validation errors
app.use(errorMiddleware);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Patientor backend running on port ${PORT}`);
});
