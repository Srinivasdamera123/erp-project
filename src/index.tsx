import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/en-gb';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import FormDateField from './components/common/FormDateField';
//import FormEditEmployee from './components/common/FormEditEmployee';

import './index.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <CssBaseline />
     <FormDateField/> 
     {/* <FormEditEmployee/>
     */}
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='en-gb'>
        <BrowserRouter>
          <Box display='flex' flexDirection='column' sx={{ minHeight: '100vh' }}>
            
            <Box flexGrow={1} display='flex'>
             
              <Box display='flex' flexGrow={1} component='main' flexDirection='column' sx={{ p: 3 }}>
              
              </Box>
            </Box>
          </Box>
        </BrowserRouter>
      </LocalizationProvider>
    
  </React.StrictMode>
);

