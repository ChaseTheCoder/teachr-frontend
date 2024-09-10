'use client'

import React from 'react';
import Surface from '../../../components/surface/Surface';
import { Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDataNoUserId } from '../../../services/authenticatedApiCalls';
import { MoreVert } from '@mui/icons-material';

export default function Calendar() {
  const { data: plansData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: () => getDataNoUserId('https://teachr-backend.onrender.com/subject/'),
    staleTime: 1000 * 60 * 60,
  })

  if (isFetching || isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error</span>
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <List sx={{bgcolor: '#ffffff', borderRadius: 4 }} dense disablePadding>
          {plansData?.map((plan, index) => (
            <>
              {index !== 0 && <Divider />}
              <ListItem key={plan.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments">
                    <MoreVert fontSize='small' />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${plan.grade}, ${plan.subject}`}
                  primaryTypographyProps={{
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}
                />
              </ListItem>
              {plan.units.map((unit) => (
                <>
                  <Divider variant="middle" component="li" />
                  <ListItem
                    key={unit.id}
                    disablePadding
                    secondaryAction={
                      <IconButton edge="end" aria-label="comments">
                        <MoreVert fontSize='small' />
                      </IconButton>
                    }
                  >
                    <ListItemButton>
                      <ListItemText
                        primary={unit.title}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 'bold'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              ))}
            </>
          ))}
        </List>
      </Grid>
      <Grid item xs={9}>
        <Surface>
          Lesson Plan
        </Surface> 
      </Grid>
    </Grid>
  )
}