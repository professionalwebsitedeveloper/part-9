import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';

import AddEntryForm from './AddEntryForm';
import { type Diagnosis, type Entry } from '../../types';

interface Props {
  diagnoses: Diagnosis[];
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Entry, 'id'>) => void;
  error?: string;
}

const AddEntryModal = ({ diagnoses, modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>New Entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm diagnoses={diagnoses} onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;
