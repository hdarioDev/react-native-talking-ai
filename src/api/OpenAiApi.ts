import {apiKey} from '../constants/environment';

export const postData = async (url: string, data: any) => {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
};
