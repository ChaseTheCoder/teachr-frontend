'use client'

import React from 'react';
import styles from '../page.module.css';
import { useEffect, useState } from "react";

export default function Plans() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
      fetch('http://127.0.0.1:8000/api/plan/')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  console.log(data)

  return (
    <div className={styles.container}>

        <h1 className={styles.title}>
          Plans
        </h1>

        { data.length > 0 ?
          data.map((data, index) => (
            <div key={index}>
              <h2>{data.grade}, {data.subject}</h2>
              { data.units.map((unit, index) => (
                <p key={index}>{unit.title}</p>
              ))}
            </div>
          )) :
          <p>Loading ....</p>
        }
    </div>
  )
}