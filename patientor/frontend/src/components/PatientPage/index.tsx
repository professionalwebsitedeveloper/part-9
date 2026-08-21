import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

import { Diagnosis, Patient } from '../../types';
import patientService from '../../services/patients';
import EntryDetails from '../EntryDetails';

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        return;
      }

      const fetchedPatient = await patientService.getById(id);
      setPatient(fetchedPatient);
    };

    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const genderIcon = (() => {
    switch (patient.gender) {
      case 'male':
        return <MaleIcon />;
      case 'female':
        return <FemaleIcon />;
      default:
        return <TransgenderIcon />;
    }
  })();

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h4">{patient.name}</Typography>
            {genderIcon}
          </Box>

          <Typography variant="body1">ssn: {patient.ssn ?? 'unknown'}</Typography>
          <Typography variant="body1">occupation: {patient.occupation}</Typography>
          <Typography variant="body1">date of birth: {patient.dateOfBirth ?? 'unknown'}</Typography>

          <Divider />

          <Typography variant="h5">Entries</Typography>
          {patient.entries.length === 0 ? (
            <Typography variant="body2">No entries recorded.</Typography>
          ) : (
            patient.entries.map((entry) => (
              <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PatientPage;
