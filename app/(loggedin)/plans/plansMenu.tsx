'use client'

import React, { useEffect, useState } from 'react';
import { Button, Collapse, Divider, Fade, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, Popper, PopperPlacementType, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteData, getData, postOrPatchData } from '../../../services/authenticatedApiCalls';
import { AddCircleOutline, ChevronRight, DeleteOutline, ExpandLess, ExpandMore, MoreVert } from '@mui/icons-material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { titleCase } from '../../../common/utils';
import { usePathname } from 'next/navigation';

export default function PlansMenu() {
  const queryClient = useQueryClient();
  const pathname = usePathname()
  const { user, error, isLoading: userLoading } = useUser();
  const auth0Id = user?.sub;
  const [createPlanType, setCreatePlanType] = useState<string | null>(null);
  const [deletePlanType, setDeletePlanType] = useState<string | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();

  const handleClickPopper =
    (newPlacement: PopperPlacementType, childPlan: string, parentPlan: string, parentPlanTitle: string, parentId: string) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setCreatePlanType(childPlan);
      setDeletePlanType(parentPlan);
      setKey(parentPlanTitle);
      setValue(parentId);
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (anchorEl && !anchorEl.contains(event.target as Node)) {
        setOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorEl]);

  const { data: plansData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/plans/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })

  const mutation = useMutation({
    mutationFn: () => {
      const body = {
        user_id: auth0Id,
      };
      if(key !== null && value !== null) {
        body[key] = value
      }
      console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/${createPlanType}/`);
      return postOrPatchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/${createPlanType}/`, 'POST', body);
    },
    onSuccess: (data) => {
      // Handle success (e.g., show a success message, update state, etc.)
      console.log('Subject added successfully:', data);
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error('Error adding subject:', error);
    },
    onSettled: () => {
      setKey(null);
      setValue(null);
      queryClient.refetchQueries({ queryKey: ['plans']})
    }
  });

  const mutationDelete = useMutation({
    mutationFn: () => {
      const body = {
        user_id: auth0Id,
      };
      if(key !== null && value !== null) {
        body[key] = value
      }
      return deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/${deletePlanType}/${value}/`);
    },
    onSuccess: (data) => {
      // Handle success (e.g., show a success message, update state, etc.)
      console.log('Subject added successfully:', data);
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error('Error adding subject:', error);
    },
    onSettled: () => {
      setKey(null);
      setValue(null);
      queryClient.refetchQueries({ queryKey: ['plans']})
    }
  });

  const handlePostPlans = () => {
    mutation.mutate();
  };

  const handleDeletePlans = () => {
    mutationDelete.mutate();
  };

  const [openUnits, setOpenUnits] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedOpenUnits = localStorage.getItem('openUnits');
      return savedOpenUnits ? JSON.parse(savedOpenUnits) : {};
    }
  });

  const handleClickUnit = (unitId) => {
    if (typeof window !== 'undefined') {
    setOpenUnits((prevOpenUnits) => {
      const newOpenUnits = {
        ...prevOpenUnits,
        [unitId]: !prevOpenUnits[unitId],
      };
      localStorage.setItem('openUnits', JSON.stringify(newOpenUnits));
      return newOpenUnits;
    });
    }
  };

  const [openPlans, setOpenPlans] = useState(() => {
    if (typeof window !== 'undefined') {
    const savedOpenPlans = localStorage.getItem('openPlans');
    return savedOpenPlans ? JSON.parse(savedOpenPlans) : {};
    }
  });

  const handleClickPlans = (planId) => {
    if (typeof window !== 'undefined') {
    setOpenPlans((prevOpenPlans) => {
      const newOpenPlans = {
        ...prevOpenPlans,
        [planId]: !prevOpenPlans[planId],
      };
      localStorage.setItem('openPlans', JSON.stringify(newOpenPlans));
      return newOpenPlans;
    });
    }
  };

  useEffect(() => {
    // Set each planId to true initially if not already set in local storage
    const initialOpenPlans = {};
    plansData?.forEach((plan) => {
      if (!(plan.id in openPlans)) {
        initialOpenPlans[plan.id] = true;
      }
    });
    const mergedOpenPlans = { ...initialOpenPlans, ...openPlans };
    setOpenPlans(mergedOpenPlans);
    localStorage.setItem('openPlans', JSON.stringify(mergedOpenPlans));
  }, [plansData]);


  if (isError) {
    return <span>Error</span>
  }

  return (
    <List sx={{bgcolor: '#ffffff', borderRadius: 4 }} dense disablePadding>
      <Popper
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <List>
                <ListItemButton 
                  sx={{ padding: 1, gap: 3 }}
                  onClick={() => handlePostPlans()}
                >
                  <AddCircleOutline fontSize='small'/>   <Typography fontSize='small'>Create {titleCase(createPlanType)}</Typography>
                </ListItemButton>
                <ListItemButton
                  sx={{ padding: 1, gap: 3 }}
                  onClick={() => handleDeletePlans()}
                >
                  <DeleteOutline fontSize='small'/>   <Typography fontSize='small'>Delete {titleCase(deletePlanType)}</Typography>
                </ListItemButton>
              </List>
            </Paper>
          </Fade>
        )}
      </Popper>
      <ListItem 
        disablePadding
        sx={{ borderRadius: 4 }}
      >
        <ListItemButton
          href={`/plans`}
          sx={{ borderRadius: 4 }}
        >
          <ListItemText
            primary='Plans Settings'
            style={{display:'flex', justifyContent:'center', }}
            primaryTypographyProps={{
              fontSize: 16,
              fontWeight: 'bold'
            }}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding style={{display:'flex', justifyContent:'center'}}>
        <Button
          size='small'
          color='success'
          component='label'
          role={undefined}
          startIcon={<AddCircleOutline/>}
          onClick={() => {
            setCreatePlanType('subject')
            setKey(null)
            setValue(null)
            handlePostPlans()
          }}
        >
          Subject
        </Button>
      </ListItem>
      {
        isLoading ? <span>Loading...</span> :
        plansData?.map((subject, index) => (
          <>
            {index !== 0 && <Divider />}
            <ListItem key={subject.id} disablePadding>
              {openPlans[subject.id] ? 
                <ExpandMore color='success' onClick={() => handleClickPlans(subject.id)} sx={{ marginX: .25 }}/> :
                <ChevronRight color='success' onClick={() => handleClickPlans(subject.id)} sx={{ marginX: .25 }}/>
              }
              <ListItemButton
                disableGutters
                href={`/plans/subject/${subject.id}`}
              >
                <ListItemText
                  primary={subject.subject}
                  primaryTypographyProps={{
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                />
              </ListItemButton>
              <IconButton onClick={handleClickPopper('bottom-start', 'unit', 'subject', 'subject', subject.id)}>
                <MoreVert fontSize='small' />
              </IconButton>
            </ListItem>
            {subject.units.length === 0 &&
              <Collapse in={openPlans[subject.id]} timeout="auto" unmountOnExit>
                <ListItem>
                  <ListItemText
                    secondary='No Added Units Yet'
                  />
                </ListItem>
              </Collapse>
            }
            {subject.units.map((unit) => (
              <>
                <Collapse in={openPlans[subject.id]} timeout="auto" unmountOnExit>
                  <ListItem
                    key={unit.id}
                    disablePadding
                  >
                    {openUnits[unit.id] ? 
                      <ExpandMore color='success' onClick={() => handleClickUnit(unit.id)} sx={{ marginX: .25 }}/> :
                      <ChevronRight color='success' onClick={() => handleClickUnit(unit.id)} sx={{ marginX: .25 }}/>
                    }
                    <ListItemButton
                      disableGutters
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
                    <IconButton onClick={handleClickPopper('bottom-start', 'lesson', 'unit', 'unit_plan', unit.id)}>
                      <MoreVert fontSize='small' />
                    </IconButton>
                  </ListItem>
                </Collapse>
                <Collapse in={openUnits[unit.id]} timeout="auto" unmountOnExit>
                  <List component="div" dense disablePadding>
                    {unit.lessons.length === 0 &&
                      <ListItem >
                        <ListItemText
                          secondary='No Added Lessons Yet'
                        />
                      </ListItem>
                    }
                    {unit.lessons.map((lesson) => (
                      <ListItem key={lesson.id} disablePadding>
                        <ListItemButton
                          href={`/plans/lesson/${lesson.id}`}
                          selected={pathname.includes(lesson.id)} 
                        >
                          <ListItemText
                            primary={lesson.title}
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
  )
}