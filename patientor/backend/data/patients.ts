export type Gender = 'male' | 'female' | 'other';

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

export const patients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    dateOfBirth: '1990-01-01',
    ssn: '010190-1234',
    gender: 'male',
    occupation: 'Engineer',
  },
  {
    id: '2',
    name: 'Jane Smith',
    dateOfBirth: '1985-05-12',
    ssn: '120585-4321',
    gender: 'female',
    occupation: 'Teacher',
  },
];
