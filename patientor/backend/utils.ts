import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  occupation: z.string(),
});

export const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    return res.status(400).send({ error: error.issues });
  }

  return next(error);
};

export type NewPatient = z.infer<typeof NewPatientSchema>;

export default NewPatientSchema;
