import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
const gender = [
  'Male',
  'Female'
];
const blood = [
  'O+',
  'O-',
  'A+',
  'B+'
];
const Experience = [
  '1',
  '2',
  '3',
  '4'
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function FormEditEmployee() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1>Edit Employee</h1>
        <FormControl sx={{ m: 1, width: 500 }}>
          <InputLabel id="demo-multiple-name-label">Recruit Type</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}  >
          <DatePicker sx={{ m: 1, width: 500 }} />
        </LocalizationProvider>
      </div>

      <div style={{ justifyContent: "space-around", marginTop: "20px", textAlign: "center" }}>
        <TextField id="outlined-basic" label="Full Name" variant="outlined" style={{ minWidth: '500px' }} />

        <FormControl sx={{ m: 1, width: 500, marginLeft: "15px", marginBottom: '10px' }}>
          <InputLabel id="demo-multiple-name-label">Gender</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {gender.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>



      </div>
      

      <div style={{ justifyContent: "space-around", marginTop: "5px", textAlign: "center" }}>
        

        <FormControl sx={{ m: 1, width: 500, marginBottom: '10px' }}>
          <InputLabel id="demo-multiple-name-label">Blood</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {blood.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField id="outlined-basic" label="Id Proof" variant="outlined" style={{ minWidth: '500px',marginTop:'10px' }} />



      </div>
      <div style={{textAlign:'center'}}>
      <TextField id="outlined-basic" label="Phone number" variant="outlined" style={{ minWidth: '500px',marginTop:'10px',marginRight:'10px'}} />
      <TextField id="outlined-basic" label="Email" variant="outlined" style={{ minWidth: '500px',marginTop:'10px',marginLeft:'10px' }} />


      </div>
      <div style={{textAlign:'center'}}>
      <TextField id="outlined-basic" label="Qualification" variant="outlined" style={{ minWidth: '500px',marginTop:'10px',marginRight:'10px'}} />
      <FormControl sx={{ m: 1, width: 500, marginBottom: '10px' }}>
          <InputLabel id="demo-multiple-name-label">Experience</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {Experience.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


      </div>
      







    </div>
  );
}
