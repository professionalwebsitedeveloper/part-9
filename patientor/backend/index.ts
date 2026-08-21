import express, { type Response, type Request } from 'express';
import { z } from 'zod';
import NewPatientSchema, { newPatientParser, errorMiddleware, type NewPatient } from './utils.ts';
import { diagnoses } from './data/diagnoses.ts';
import { patients, HealthCheckRating } from './data/patients.ts';
import { Gender, type Patient, type Entry } from './data/patients.ts';

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

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ]),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
});

const EntrySchema = z.union([
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
  HealthCheckEntrySchema,
]);

app.post('/api/patients/:id/entries', (req: Request<{ id: string }>, res: Response<Entry | { error: string }>) => {
  const patient = patients.find((p) => p.id === req.params.id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  try {
    const parsed = EntrySchema.parse(req.body) as Entry;
    const newEntry: Entry = {
      ...parsed,
      id: generateId(),
    };

    patient.entries.push(newEntry);
    return res.json(newEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues.map((issue) => issue.message).join(', ') });
    }
    return res.status(400).json({ error: 'Invalid entry' });
  }
});

// error handling middleware for validation errors
app.use(errorMiddleware);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Patientor backend running on port ${PORT}`);
});
