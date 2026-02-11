import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const options = [
  { value: '', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
];

export default function RecurrenceSelect({ value, onChange }) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>Repeat</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        label="Repeat"
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
