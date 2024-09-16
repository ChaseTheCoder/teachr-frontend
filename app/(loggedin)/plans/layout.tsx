'use client'

import React, { useEffect, useState } from 'react';
import { Button, Collapse, Divider, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../../services/authenticatedApiCalls';
import { AddCircleOutline, ExpandLess, ExpandMore, MoreVert } from '@mui/icons-material';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, error, isLoading: userLoading } = useUser();
  const auth0Id = user?.sub;
  console.log(auth0Id);
  const plansURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/plans/${auth0Id}`
  console.log(plansURL);

  const [openUnits, setOpenUnits] = useState({});
  const handleClickUnit = (unitId) => {
    setOpenUnits((prevOpenUnits) => ({
      ...prevOpenUnits,
      [unitId]: !prevOpenUnits[unitId],
    }));
  };

  const [openPlans, setOpenPlans] = useState({});
  const handleClickPlans = (planId) => {
    setOpenPlans((prevOpenPlans) => ({
      ...prevOpenPlans,
      [planId]: !prevOpenPlans[planId],
    }));
  };
  
  const { data: plansData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: () => getData(plansURL),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })

  useEffect(() => {
    // Set each planId to true initially
    const initialOpenPlans = {};
    plansData?.forEach((plan) => {
      initialOpenPlans[plan.id] = true;
    });
    setOpenPlans(initialOpenPlans);
  }, [plansData]);

  if (userLoading || isFetching || isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error</span>
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <List sx={{bgcolor: '#ffffff', borderRadius: 4 }} dense disablePadding>
          <ListItem disablePadding style={{display:'flex', justifyContent:'center'}}>
            <Button
              size='small'
              component="label"
              role={undefined}
              startIcon={<AddCircleOutline/>}
              onClick={() => { 
                // mutationSubject.mutate()
              }}
            >
              Subject
            </Button>
          </ListItem>
          {plansData?.map((plan, index) => (
            <>
              {index !== 0 && <Divider />}
              <ListItem key={plan.id} disablePadding>
                <ListItemButton
                  href={`/plans/subject/${plan.id}`}
                >
                  <ListItemText
                    primary={`${plan.grade}, ${plan.subject}`}
                    primaryTypographyProps={{
                      fontSize: 18,
                      fontWeight: 'bold'
                    }}
                  />
                </ListItemButton>
                <MoreVert fontSize='small' />
                {openPlans[plan.id] ? <ExpandLess onClick={() => handleClickPlans(plan.id)}/> : <ExpandMore onClick={() => handleClickPlans(plan.id)}/>}
              </ListItem>
              {plan.units.map((unit) => (
                <>
                  <Collapse in={openPlans[plan.id]} timeout="auto" unmountOnExit>
                    <ListItem
                      key={unit.id}
                      disablePadding
                    >
                      <ListItemButton
                        href={`/plans/unit/${unit.id}`}
                      >
                        <ListItemText
                          primary={unit.title}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 'bold'
                          }}
                        />
                      </ListItemButton>
                      <MoreVert fontSize='small' />
                      {openUnits[unit.id] ? <ExpandLess onClick={() => handleClickUnit(unit.id)}/> : <ExpandMore onClick={() => handleClickUnit(unit.id)}/>}
                    </ListItem>
                  </Collapse>
                  <Collapse in={openUnits[unit.id]} timeout="auto" unmountOnExit>
                    <List component="div" dense disablePadding>
                        {unit.lessons.map((lesson) => (
                          <ListItem key={lesson.id} disablePadding>
                            <ListItemButton
                              href={`/plans/lesson/${lesson.id}`}
                            >
                              <ListItemText
                                primary={lesson.title}
                                primaryTypographyProps={{
                                  fontSize: 14
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                    </List>
                  </Collapse>
                </>
              ))}
            </>
          ))}
        </List>
      </Grid>
      <Grid item xs={9}>
        {children}
      </Grid>
    </Grid>
  )
}