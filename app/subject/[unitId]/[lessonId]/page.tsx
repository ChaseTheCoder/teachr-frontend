'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../../../components/surface/Surface';
import TextField from '../../../../components/TextField';

export default function Unit({
  params,
}: {
  params: { lessonId: string, unitId: string };
}) {
  const [lesson, setLesson] = useState<any>();
  const url = 'http://localhost:8000/api/lessonplan/' + params.lessonId; 

  useEffect(() => {
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setLesson(data)
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
  }, [url]);

  return (
    <div className='pt-16 space-y-3'>
        { lesson ?
          (
            <>
              <Surface>
                <div className='space-y-2'>
                  <h2  className='text-2xl font-bold'>{lesson.title}</h2>
                  <div>
                    <h3 className='font-semibold'>Objective</h3>
                    <TextField>{lesson.objective}</TextField>
                  </div>
                  <div>
                    <h3 className='font-semibold'>Standards</h3>
                    <TextField>{lesson.standard}</TextField>
                  </div>
                  <div className='space-y-1'>
                    <h3 className='font-semibold'>Lesson Outline</h3>
                    { lesson.lesson_outline.length > 0 ? (
                      lesson.lesson_outline.map((outline) => (
                        <div key={outline.id}>
                            <TextField>
                              <h4 className='font-semibold'>{outline.title}</h4>
                              <p>{outline.description}</p>
                            </TextField>
                          </div>
                        ))
                        ) : (
                          <p>Add outline</p>
                        )
                      }
                    </div>
                  </div>
                </Surface>
            </>
          ) :
          <p>Loading ....</p>
        }
    </div>
  )
}