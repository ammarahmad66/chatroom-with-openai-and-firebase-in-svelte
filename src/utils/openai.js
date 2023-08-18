// import { Configuration, OpenAIApi } from "openai" ;
import axios from 'axios';

const openAIKey= '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'

export async function getOpenAIResponse(message) {
// const configuration = new Configuration({
//   apiKey: openAIKey,
// });
// const openai = new OpenAIApi(configuration);
const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { 
        model: "gpt-3.5-turbo",
        messages: [{role:"user", content:message}],
        max_tokens: 50,
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${openAIKey}`,
        },
      })
// const response = await openai.createCompletion({
//   model: "text-davinci-003",
//   prompt: message,
//   max_tokens: 7,
//   temperature: 0,
// });
return response.data.choices[0].message.content;
};


