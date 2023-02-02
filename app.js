const express = require('express');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/tanya', async (req, res) => {
  const { prompt } = req.body;
  const responseBody = {
    success: false,
  };
  let status = 200;
  if (prompt !== undefined && prompt !== '') {
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${prompt}\nA:`,
        temperature: 0.2,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ['\n'],
      });

      console.log(response.data.choices);

      if (response) {
        responseBody.success = true;
        responseBody.data = response.data.choices[0].text !== '' ? response.data.choices[0].text : 'Jawaban Tidak Ditemukan';
      }
    } catch (error) {
      status = 500;
      responseBody.error = error.response ? error.response.data : 'Server Error';
    }
  } else {
    responseBody.error = 'Invalid Parameter';
  }

  return res.status(status).send(responseBody);
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
