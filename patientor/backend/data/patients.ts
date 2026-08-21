export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export interface Entry {}

export const patients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    dateOfBirth: '1990-01-01',
    ssn: '010190-1234',
    gender: 'male',
    occupation: 'Engineer',
    entries: [],
  },
  {
    id: '2',
    name: 'Jane Smith',
    dateOfBirth: '1985-05-12',
    ssn: '120585-4321',
    gender: 'female',
    occupation: 'Teacher',
    entries: [],
  },
];
