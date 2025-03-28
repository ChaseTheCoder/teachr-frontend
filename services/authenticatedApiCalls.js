'use server'
import { getAccessToken, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function getData(apiUrl) {
  try {
    const { accessToken } = await getAccessToken();
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error.name === 'AccessTokenError') {
      console.error('AccessTokenError:', error);
      redirect('/api/auth/logout/');
    } else {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}

export async function getDataWithParams(apiUrl, key, params) {
  const accessToken = await getAccessToken();
  let urlWithParams = new URL(apiUrl);
  await params.forEach(date => urlWithParams.searchParams.append(key, date));

  const response = await fetch(urlWithParams, {
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
  console.log('Request body before stringify:', body);
  const stringifiedBody = JSON.stringify(body);
  console.log('Request body after stringify:', stringifiedBody);

  const response = await fetch(apiUrl, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`,
    },
    body: stringifiedBody,
  });

  // Log the raw response
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function patchData(apiUrl) {
  const accessToken = await getAccessToken();

  const response = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`,
    }
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

export async function postSchedule(body) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export const handleVerify = async (email, profileId) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/verify-email/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`
    },
    body: JSON.stringify({ email: email, user_id: profileId }),
  });

  const result = await response.json();
  return result;
};