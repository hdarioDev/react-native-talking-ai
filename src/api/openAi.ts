import {apiKey, chatgptUrl, dalleUrl} from '../constants/environment';

interface ResponseMessage {
  role: string;
  content: string;
}

export interface ApiResponse {
  success: boolean;
  msg?: string;
  data?: ResponseMessage[];
}

export const apiCall = async (prompt: string, messages: ResponseMessage[]) => {
  console.log('--------> prompt ', prompt, messages);

  try {
    // const isArt = await checkIfArtMessage(prompt);
    // console.log('isArt: ', isArt);

    // if (isArt) {
    //   console.log('dalle api call');
    //   return dalleApiCall(prompt, messages);
    // } else {
    console.log('chatgpt api call');
    // return chatgptApiCall(prompt, messages);
    // }
  } catch (err) {
    console.log('error apiCall: ', err);
    return Promise.resolve({success: false, msg: (err as Error).message});
  }
};

const checkIfArtMessage = async (prompt: string): Promise<boolean> => {
  try {
    const response = await postData(chatgptUrl, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Does this message want to generate an AI picture, image, art or anything similar? ${prompt} . Simply answer with a yes or no.`,
        },
      ],
    });

    const isArt = response?.choices[0]?.message?.content;
    console.log('🚀 ~ file: openAi.ts:47 ~ checkIfArtMessage ~ isArt:', isArt);
    return isArt ? isArt.trim().toLowerCase().includes('yes') : false;
  } catch (err) {
    console.log('error checkIfArtMessage : ', err);
    throw err;
  }
};

export const chatgptApiCall = async (messages: ResponseMessage[]) => {
  console.log('======>   chatgptApiCall ', JSON.stringify(messages, null, 2));

  try {
    console.log('LE ENVIO ', JSON.stringify(messages, null, 2));

    const response = await postData(chatgptUrl, {
      model: 'gpt-3.5-turbo',
      messages,
    });

    const answer = response?.choices[0]?.message?.content;
    // console.log('answer chatgpt: ', answer);

    const newMessages = [
      ...messages,
      {role: 'assistant', content: answer.trim()},
    ];

    console.log(
      '======>  RETURN API MESS ',
      JSON.stringify(newMessages, null, 2),
    );

    return Promise.resolve({success: true, data: newMessages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: (err as Error).message});
  }
};

const dalleApiCall = async (prompt: string, messages: ResponseMessage[]) => {
  try {
    const response = await postData(dalleUrl, {
      prompt,
      n: 1,
      size: '512x512',
    });

    const url = response?.data[0]?.url;
    console.log('url image dell : ', url);

    messages.push({role: 'assistant', content: url});

    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: (err as Error).message});
  }
};

const postData = async (url: string, data: any) => {
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
