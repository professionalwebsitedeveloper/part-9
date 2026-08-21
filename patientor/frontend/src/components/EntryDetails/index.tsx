import {
  Box,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';

import { Diagnosis, Entry } from '../../types';

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const getDiagnosisName = (diagnoses: Diagnosis[], code: string) => {
  const diagnosis = diagnoses.find((item) => item.code === code);
  return diagnosis ? diagnosis.name : 'Unknown diagnosis';
};

const getHealthCheckRatingText = (rating: number) => {
  switch (rating) {
    case 0:
      return 'Healthy';
    case 1:
      return 'Low risk';
    case 2:
      return 'High risk';
    case 3:
      return 'Critical risk';
    default:
      return 'Unknown';
  }
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry, diagnoses }: Props) => {
  switch (entry.type) {
    case 'Hospital': {
      return (
        <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalHospitalIcon color="error" />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {entry.date} - {entry.type}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {entry.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Discharge: {entry.discharge.date} — {entry.discharge.criteria}
          </Typography>
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            <List dense sx={{ pl: 2, mb: 0 }}>
              {entry.diagnosisCodes.map((code) => (
                <ListItem key={code} sx={{ display: 'list-item', py: 0 }}>
                  {code}: {getDiagnosisName(diagnoses, code)}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      );
    }
    case 'OccupationalHealthcare': {
      return (
        <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <WorkIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {entry.date} - {entry.type}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {entry.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Employer: {entry.employerName}
          </Typography>
          {entry.sickLeave && (
            <Typography variant="body2">
              Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
            </Typography>
          )}
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            <List dense sx={{ pl: 2, mb: 0 }}>
              {entry.diagnosisCodes.map((code) => (
                <ListItem key={code} sx={{ display: 'list-item', py: 0 }}>
                  {code}: {getDiagnosisName(diagnoses, code)}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      );
    }
    case 'HealthCheck': {
      return (
        <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FavoriteIcon color={entry.healthCheckRating === 0 ? 'success' : entry.healthCheckRating === 3 ? 'error' : 'warning'} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {entry.date} - {entry.type}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {entry.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Health check rating: {getHealthCheckRatingText(entry.healthCheckRating)}
          </Typography>
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            <List dense sx={{ pl: 2, mb: 0 }}>
              {entry.diagnosisCodes.map((code) => (
                <ListItem key={code} sx={{ display: 'list-item', py: 0 }}>
                  {code}: {getDiagnosisName(diagnoses, code)}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      );
    }
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
