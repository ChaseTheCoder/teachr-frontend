export async function getDataNoToken(apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function getDataWithParamsNoToken(apiUrl, key, params) {
  let urlWithParams = new URL(apiUrl);
  await params.forEach(date => urlWithParams.searchParams.append(key, date));

  const response = await fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const result = await response.json();
  return result;
}