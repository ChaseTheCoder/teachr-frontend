'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../../components/surface/Surface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import TextField from '../../../components/TextField';

export default function Unit({
  params,
}: {
  params: { unitId: string };
}) {
  const [unit, setUnit] = useState<any>();
  const [lessons, setLessons] = useState<any>();
  const url = 'http://localhost:8000/api/unitplan/' + params.unitId;

  useEffect(() => {
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setUnit(data)
      setLessons(data.lessons)
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
  }, [url]);
  // console.log(unit);
  console.log(lessons);

  return (
    <div className='pt-16 space-y-3'>
      
        { unit ?
          (
            <>
              <Surface>
                <div className='space-y-3'>
                  <h2  className='text-lg font-semibold'>{unit.title}</h2>
                  <div>
                    <h3 className='font-bold'>Overview</h3>
                    <TextField>{unit.overview}</TextField>
                  </div>
                  <div>
                    <h3 className='font-semibold'>Standards</h3>
                    <TextField>{unit.standard}</TextField>
                  </div>
                  <div>
                    <h3 className='font-semibold'>Resources</h3>
                    { unit.resources.length > 0 ? (
                      <ul>
                        { unit.resources.map((resource) => (
                          <li key={resource.id}>
                            <a href={resource.link} target='_blank'>
                              <p className=''>{resource.title}</p>
                            </a>
                          </li>
                        ))}
                      </ul>
                      ) : (
                        <p>No resources yet</p>
                      )
                    }
                  </div>
                </div>
                </Surface>
                  
                <Surface>
                  <h3 className='text-lg font-semibold pb-2'>Lessons</h3>
                  { unit.lessons.length > 0 ? (
                    <ul>
                      { unit.lessons.map((lesson) => (
                        <li key={lesson.id} className='border-t-2 border-border py-2 px-3'>
                          <Link href={`/subject/${params.unitId}/${lesson.id}`} className='flex justify-between px-3'>
                            <p>{lesson.title}</p>
                            <FontAwesomeIcon icon={faChevronRight} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    ) : (
                      <p>No lessons yet</p>
                    )
                  }
                </Surface>
            </>
          ) :
          <p>Loading ....</p>
        }
    </div>
  )
}