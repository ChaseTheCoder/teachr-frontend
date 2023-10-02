'use client'

import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Surface from '../../components/surface/Surface';

export default function Plans() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
      fetch('http://127.0.0.1:8000/api/plan/')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  console.log(data)

  return (
    <div className='pt-16 space-y-3'>
        { data.length > 0 ?
          data.map((data, index) => (
            <Surface key={index}>
              <h2  className='text-lg font-semibold'>{data.grade}, {data.subject}</h2>
              { data.units.map((unit, index) => (
                <Link key={index} href={`/plan/${unit.id}`}>
                  <p>{unit.title}</p>
                </Link>
              ))}
            </Surface>
          )) :
          <p>Loading ....</p>
        }
    </div>
  )
}