'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../../components/surface/Surface';

export default function Unit({
  params,
}: {
  params: { id: string };
}) {
  const [unit, setUnit] = useState<any>();
  const [lessons, setLessons] = useState<any>();
  const url = 'http://localhost:8000/api/unitplan/' + params.id; 

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
    <div className='pt-16'>
      <Surface>
        { unit ?
          (
            <div>
              <h2  className='text-lg font-semibold'>{unit.title}</h2>
              <h3 className='font-semibold'>Overview</h3>
              <p>{unit.overview}</p>
              <h3 className='font-semibold'>Standards</h3>
              <p>{unit.standard}</p>
              <h3 className='font-semibold'>Resources</h3>
              { unit.resources.length > 0 ? (
                  <ul>
                    { unit.resources.map((resource) => (
                      <li key={resource.id}>
                        <a href={resource.link} target='_blank'>
                          <p>{resource.title}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No resources yet</p>
                )
              }
              

              <h3 className='font-semibold'>Lessons</h3>
              { unit.lessons.length > 0 ? (
                  <ul>
                    { unit.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <p>{lesson.title}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No lessons yet</p>
                )
              }
            </div>
          ) :
          <p>Loading ....</p>
        }
      </Surface>
    </div>
  )
}