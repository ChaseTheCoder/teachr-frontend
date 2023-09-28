'use client'

import React from 'react';
import styles from '../../page.module.css';
import { useEffect, useState } from "react";

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
      console.error("Error fetching data:", error);
    })
  }, [url]);
  // console.log(unit);
  console.log(lessons);

  return (
    <div className={styles.container}>

        <h1 className={styles.title}>
          Unit Plans
        </h1>

        { unit ?
          (
            <div>
              <h2>{unit.title}</h2>
              <h3>Overview</h3>
              <p>{unit.overview}</p>
              <h3>Standards</h3>
              <p>{unit.standard}</p>
              <h3>Resources</h3>
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
              

              <h3>Lessons</h3>
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
    </div>
  )
}