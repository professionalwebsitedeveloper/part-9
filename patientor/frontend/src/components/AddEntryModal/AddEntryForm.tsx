import { useState, type SyntheticEvent } from 'react';
import {
  TextField,
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';

import {
  HealthCheckRating,
  type Entry,
  type HealthCheckEntry,
  type HealthCheckRating as HealthCheckRatingValue,
  type HospitalEntry,
  type OccupationalHealthcareEntry,
} from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: Omit<Entry, 'id'>) => void;
}

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [entryType, setEntryType] = useState<'HealthCheck' | 'OccupationalHealthcare' | 'Hospital'>('HealthCheck');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRatingValue>(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  const onEntryTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    const type = event.target.value as 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital';
    setEntryType(type);
  };

  const onRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    const nextValue = Number(event.target.value) as HealthCheckRatingValue;
    setHealthCheckRating(nextValue);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const parsedDiagnosisCodes = diagnosisCodes
      ? diagnosisCodes.split(',').map((code) => code.trim()).filter(Boolean)
      : undefined;

    let entryPayload: Omit<Entry, 'id'>;

    if (entryType === 'HealthCheck') {
      entryPayload = {
        date,
        type: 'HealthCheck',
        specialist,
        description,
        healthCheckRating,
        diagnosisCodes: parsedDiagnosisCodes,
      } as Omit<HealthCheckEntry, 'id'>;
      onSubmit(entryPayload);
      return;
    }

    if (entryType === 'OccupationalHealthcare') {
      entryPayload = {
        date,
        type: 'OccupationalHealthcare',
        specialist,
        description,
        employerName,
        diagnosisCodes: parsedDiagnosisCodes,
        sickLeave: sickLeaveStart && sickLeaveEnd ? { startDate: sickLeaveStart, endDate: sickLeaveEnd } : undefined,
      } as Omit<OccupationalHealthcareEntry, 'id'>;
      onSubmit(entryPayload);
      return;
    }

    entryPayload = {
      date,
      type: 'Hospital',
      specialist,
      description,
      diagnosisCodes: parsedDiagnosisCodes,
      discharge: {
        date: dischargeDate,
        criteria: dischargeCriteria,
      },
    } as Omit<HospitalEntry, 'id'>;
    onSubmit(entryPayload);
  };

  return (
    <form onSubmit={addEntry}>
      <InputLabel sx={{ marginTop: 2 }}>Entry type</InputLabel>
      <Select fullWidth value={entryType} onChange={onEntryTypeChange}>
        <MenuItem value="HealthCheck">Health Check</MenuItem>
        <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
        <MenuItem value="Hospital">Hospital</MenuItem>
      </Select>

      <TextField
        label="Date"
        fullWidth
        value={date}
        onChange={({ target }) => setDate(target.value)}
        sx={{ marginTop: 2 }}
      />
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        sx={{ marginTop: 2 }}
      />
      <TextField
        label="Specialist"
        fullWidth
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
        sx={{ marginTop: 2 }}
      />

      {entryType === 'HealthCheck' && (
        <>
          <InputLabel sx={{ marginTop: 2.5 }}>Health Check Rating (0-3)</InputLabel>
          <Select fullWidth value={String(healthCheckRating)} onChange={onRatingChange}>
            {Object.entries(HealthCheckRating).map(([label, value]) => (
              <MenuItem key={label} value={String(value)}>
                {value} - {label}
              </MenuItem>
            ))}
          </Select>
        </>
      )}

      {entryType === 'OccupationalHealthcare' && (
        <>
          <TextField
            label="Employer name"
            fullWidth
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Sick leave start"
            fullWidth
            value={sickLeaveStart}
            onChange={({ target }) => setSickLeaveStart(target.value)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Sick leave end"
            fullWidth
            value={sickLeaveEnd}
            onChange={({ target }) => setSickLeaveEnd(target.value)}
            sx={{ marginTop: 2 }}
          />
        </>
      )}

      {entryType === 'Hospital' && (
        <>
          <TextField
            label="Discharge date"
            fullWidth
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Discharge criteria"
            fullWidth
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
            sx={{ marginTop: 2 }}
          />
        </>
      )}

      <TextField
        label="Diagnosis Codes (comma-separated)"
        fullWidth
        value={diagnosisCodes}
        onChange={({ target }) => setDiagnosisCodes(target.value)}
        sx={{ marginTop: 2 }}
      />

      <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
        <Grid size="auto">
          <Button color="secondary" variant="contained" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
        <Grid size="auto">
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddEntryForm;
