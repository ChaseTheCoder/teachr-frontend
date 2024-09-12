'use client'

import React, { useEffect, useState } from 'react';
import { Button, Collapse, Divider, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getDataNoUserId } from '../../../services/authenticatedApiCalls';
import { AddCircleOutline, ExpandLess, ExpandMore, MoreVert } from '@mui/icons-material';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { user, error, isLoading: userLoading } = useUser();
  // const userIdEncode = user?.sub;

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

  // const { data: profileData, isFetching: isFetchingProfle, isLoading: isLoadingProfile, isError: isErrorProfile } = useQuery({
  //   queryKey: ['profile'],
  //   queryFn: () => getDataNoUserId(`https://teachr-backend.onrender.com/userprofile/profile/${userIdEncode}/`),
  //   staleTime: 1000 * 60 * 60, // 1 hour in ms
  // })

  // const profile = profileData;
  
  const { data: plansData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: () => getDataNoUserId('https://teachr-backend.onrender.com/plans/'),
    staleTime: 1000 * 60 * 60,
    // enabled: !!profile,
  })

  useEffect(() => {
    // Set each planId to true initially
    const initialOpenPlans = {};
    plansData?.forEach((plan) => {
      initialOpenPlans[plan.id] = true;
    });
    setOpenPlans(initialOpenPlans);
  }, [plansData]);

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
          <ListItem disablePadding style={{display:'flex', justifyContent:'center'}}>
            <Button
              size='small'
              component="label"
              role={undefined}
              startIcon={<AddCircleOutline/>}
              onClick={() => {}}
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