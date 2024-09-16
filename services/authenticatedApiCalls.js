'use server'
import { getAccessToken, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { QueryCache, useQuery } from '@tanstack/react-query';

export async function getData(apiUrl) {
  const accessToken = await getAccessToken();

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function getDataNoUserId(apiUrl) {
  const accessToken = await getAccessToken();

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
}
  const result = await response.json();
  return result;
}

export async function postOrPatchData(apiUrl, method, body) {
  const accessToken = await getAccessToken();

  const response = await fetch(apiUrl, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
}
  const result = await NextResponse.json(response);
  return result;
}

export async function deleteData(apiUrl) {
  const accessToken = await getAccessToken();

  const response = await fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken.accessToken}`,
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
}
  const result = await NextResponse.json(response);
  return result;
}

export async function navigate(url) {
  redirect(url)
}

export async function getSessionId() {
  const session = await getSession();
  return session.user.sub;
}