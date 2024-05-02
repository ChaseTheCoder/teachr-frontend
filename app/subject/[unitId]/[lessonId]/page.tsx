'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Surface from '../../../../components/surface/Surface';
import TextField from '../../../../components/TextField';
import Textarea from '../../../../components/Textarea';

export default function Unit({
  params,
}: {
  params: { lessonId: string, unitId: string };
}) {
  const [lesson, setLesson] = useState<any>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [objective, setObjective] = useState<string | null>(null);
  const [standard, setStandard] = useState<string | null>(null);
  const url = `http://localhost:8000/lessonplan/${params.lessonId}/`;
  let update = {}

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

  useEffect(() => {
    if(title !== null) update['title'] = title;
    if(objective !== null) update['objective'] = objective;
    if(standard !== null) update['standard'] = standard;
  }, [title, objective, standard]);

  const updateButton = () => {
    fetch(url, {      
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: 
        JSON.stringify(update),
    })
    .then((response) => response.json())
    .catch(error => console.log(error))
  }

  async function deleteLesson(id: string) {
    window.alert('deleted');
  }

  return (
    <div className='pt-16 space-y-3'>
        { lesson ?
          (
            <>
              <Surface>
                <div className='space-y-4'>
                  <form>
                    <div className='flex justify-between'>
                      <Textarea
                        value={lesson.title}
                        onChange={e => setTitle(e.target.value)}
                        header
                      />
                      <div className='flex flex-row gap-6'>
                        <button className='text-delete-light hover:text-delete' onClick={() => deleteLesson(params.lessonId)}>Delete</button>
                        <button className='text-update-light hover:text-update' onClick={updateButton}>Update</button>
                      </div>
                    </div>
                    <div>
                      <h3 className='font-semibold'>Objective</h3>
                      <Textarea
                        value={lesson.objective}
                        onChange={e => setObjective(e.target.value)}
                      />
                    </div>
                    <div>
                      <h3 className='font-semibold'>Standards</h3>
                      <Textarea
                        value={lesson.standard}
                        onChange={e => setStandard(e.target.value)}
                      />
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
                    <div>
                      <h3 className='font-semibold'>Materials</h3>
                      {lesson.materials &&
                        lesson.materials.map(material => (
                          <p key={material.id}>
                            <a
                              href={material.link}
                              target='blank'
                            >
                              {material.title}
                            </a>
                          </p>
                        ))
                      }
                    </div>
                    </form>
                  </div>
                </Surface>
            </>
          ) :
          <p>Loading ....</p>
        }
    </div>
  )
}