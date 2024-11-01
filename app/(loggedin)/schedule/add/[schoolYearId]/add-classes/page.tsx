import React from 'react';

export default function AddCalendar({
  params,
}: {
  params: { schoolYearId: string };
}) {
  return (
    <div>
      <h1>Add classes</h1>
      <p>School year ID: {params.schoolYearId}</p>
    </div>
  )
}
