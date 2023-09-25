'use client'

import React from 'react';
import styles from '../../page.module.css';
import { useEffect, useState } from "react";

export default function Plans() {
  const [unit, setUnit] = useState<any>();

  useEffect(() => {

    fetch('http://localhost:8000/api/unitplan/1')
    .then((res) => res.json())
    .then((data) => setUnit(data))
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
  }, []);
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
            </div>
          ) :
          <p>Loading ....</p>
        }
    </div>
  )
}