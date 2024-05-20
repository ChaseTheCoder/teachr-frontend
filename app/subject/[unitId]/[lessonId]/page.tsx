'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Surface from '../../../../components/surface/Surface';
import TextField from '../../../../components/TextField';
import Textarea from '../../../../components/Textarea';
import CKeditor from '../../../../components/CKeditor';
import { lessonAi } from './lessonAi';

export default function Unit({
  params,
}: {
  params: { lessonId: string, unitId: string };
}) {
  const [lesson, setLesson] = useState<any>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [objective, setObjective] = useState<string | null>(null);
  const [objectiveAi, setObjectiveAi] = useState<string | null>(null);
  const [standard, setStandard] = useState<string | null>(null);
  const [body, setBody] = useState<string | null>(null);
  const [lessonOutline, setLessonOutline] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const url = `http://localhost:8000/lessonplan/${params.lessonId}/`;
  let update = {}

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

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
    if(body !== null) update['body'] = body;
  }, [title, objective, standard, body]);

  const updateLessonButton = () => {
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

  async function updateObjectiveAi(prompt: string) {
    const promptResponse = await lessonAi(prompt);
    window.alert(promptResponse.choices[0].message.content);
    console.log(promptResponse.choices[0].message.content)
  }

  const updateLessonOutlineButton = () => {
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
                  <form className='space-y-3'>
                    <div className='flex justify-between'>
                      <Textarea
                        value={lesson.title}
                        onChange={e => setTitle(e.target.value)}
                        header
                      />
                      <div className='flex flex-row gap-6'>
                        <button className='text-delete-light hover:text-delete' onClick={() => deleteLesson(params.lessonId)}>Delete</button>
                        <button className='text-update-light hover:text-update' onClick={updateLessonButton}>Update</button>
                      </div>
                    </div>
                    <div>
                      <h3 className='font-semibold'>Objective</h3>
                      <div>
                        <button
                          onClick={() => updateObjectiveAi(objectiveAi)}
                        >
                          AI
                        </button>
                        <Textarea
                          value={objectiveAi ? objectiveAi : 'write a lesson objective for 2nd grade'}
                          onChange={e => updateObjectiveAi(e.target.value)}
                        />
                      </div>
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
                    <div>
                      <h3 className='font-semibold'>Lesson Outline</h3>
                      <CKeditor
                        name="description"
                        onChange={(data) => {
                          setBody(data);
                        } }
                        editorLoaded={editorLoaded} value={lesson.body}
                      />
                    </div>
                    <div>
                      <h3 className='font-semibold'>Materials</h3>
                      {lesson.materials &&
                        lesson.materials.map((material, index) => (
                          <div className='flex justify-between' key={index}>
                            <p key={material.id} className='hover:underline'>
                              <a
                                href={material.link}
                                target='blank'
                              >
                                {material.title}
                              </a>
                            </p>
                            <div className='flex gap-2'>
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                className='hover:text-gray'
                              />
                              <FontAwesomeIcon
                                icon={faTrash}
                              />
                            </div>
                          </div>
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