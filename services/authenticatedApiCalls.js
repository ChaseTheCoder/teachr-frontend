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
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AccessTokenError') {
      console.error('AccessTokenError:', error);
      return null;
    }
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function getDataWithParams(apiUrl, key, params) {
  console.log('getDataWithParams', apiUrl, key, params);
  const accessToken = await getAccessToken();
  let urlWithParams = new URL(apiUrl);
  await params.forEach(date => urlWithParams.searchParams.append(key, date));

  const response = await fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`,
      'Accept': 'application/json'
    },
    credentials: 'include'
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
      'Authorization': `Bearer ${accessToken.accessToken}`,
      'Accept': 'application/json'
    },
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
}
  const result = await response.json();
  return result;
}

export async function postOrPatchData(apiUrl, method, body) {
  const accessToken = await getAccessToken();
  const stringifiedBody = JSON.stringify(body);

  const response = await fetch(apiUrl, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`,
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: stringifiedBody,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}

export async function postProfilePic(apiUrl, body) {
  try {
    const { accessToken } = await getAccessToken();
    console.log('Uploading to:', apiUrl);  // Debug log

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: body,
    });

    console.log('Response status:', response.status);  // Debug log

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);  // Debug log
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    try {
      const result = await response.json();
      return result;
    } catch (error) {
      if (error instanceof SyntaxError) {
        return null;
      }
      throw error;
    }
  } catch (error) {
    console.error('Upload error:', error);  // Debug log
    throw error;
  }
}

export async function patchData(apiUrl) {
  const accessToken = await getAccessToken();

  const response = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken.accessToken}`,
      'Accept': 'application/json',
    },
    credentials: 'include'
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
      'Authorization': `Bearer ${accessToken.accessToken}`,
      'Accept': 'application/json'
    },
    credentials: 'include',
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
      'Authorization': `Bearer ${accessToken.accessToken}`,
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email: email, user_id: profileId }),
  });

  const result = await response.json();
  return result;
};