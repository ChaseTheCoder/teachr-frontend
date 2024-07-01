import React from 'react';
import Surface from './surface/Surface';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

const reminders = [
  {
    id: '1',
    title: 'Make Angles poster',
    checked: false,
  },
  {
    id: '2',
    title: 'Get glue',
    checked: false,
  },
  {
    id: '3',
    title: 'Classroom Newsletter',
    checked: true,
  }
]

export default function Reminders() {

  return (
    <Box sx={{ paddingRight: '8px' }}>
      <Surface>
        <Typography variant='h3' fontSize={18} fontWeight='bold'>
          Reminders
        </Typography>
        <FormGroup>
          {
            reminders.map((reminder) => {
              return (
                <FormControlLabel
                  key={reminder.id}
                  control={<Checkbox size='small' />}
                  color='success'
                  label={reminder.title}
                />
              )
            })
          }
        </FormGroup>
      </Surface>
    </Box>
  )
}