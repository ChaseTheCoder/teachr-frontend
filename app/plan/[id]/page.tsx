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
  console.log(unit);

  return (
    <div className={styles.container}>

        <h1 className={styles.title}>
          Unit Plans
        </h1>

        { unit ?
          (
            <div>
              <h2>{unit.title}</h2>
              <p>{unit.overview}</p>
              <p>{unit.standard}</p>
              <p>{unit.lessons[0].title}</p>
              <ul>
              { lessons.length > 0 &&
                  lessons.map((lesson) => {
                    <li key={lesson.id}>{lesson.title}</li>
                  })
              }
              </ul>
            </div>
          ) :
          <p>Loading ....</p>
        }
    </div>
  )
}