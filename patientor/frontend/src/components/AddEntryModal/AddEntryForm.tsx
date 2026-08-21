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

import { HealthCheckRating, type HealthCheckEntry, type HealthCheckRating as HealthCheckRatingValue } from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: Omit<HealthCheckEntry, 'id'>) => void;
}

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRatingValue>(HealthCheckRating.Healthy);
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  const onRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    const nextValue = Number(event.target.value) as HealthCheckRatingValue;
    setHealthCheckRating(nextValue);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    onSubmit({
      date,
      type: 'HealthCheck',
      specialist,
      description,
      healthCheckRating,
      diagnosisCodes: diagnosisCodes
        ? diagnosisCodes.split(',').map((code) => code.trim()).filter(Boolean)
        : undefined,
    });
  };

  return (
    <form onSubmit={addEntry}>
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

      <InputLabel sx={{ marginTop: 2.5 }}>Health Check Rating (0-3)</InputLabel>
      <Select
        fullWidth
        value={String(healthCheckRating)}
        onChange={onRatingChange}
      >
        {Object.entries(HealthCheckRating).map(([label, value]) => (
          <MenuItem key={label} value={String(value)}>
            {value} - {label}
          </MenuItem>
        ))}
      </Select>

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
