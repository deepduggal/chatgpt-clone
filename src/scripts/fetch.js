window.process = { env: { OPENAI_API_KEY: null } };
// process.env.OPENAI_API_KEY = '';

// A sample response from the chatgpt api
const sampleResponse = {
  "id": "chatcmpl-8zFYfezrGdtFUs2wnuDJDeReIblaJ",
  "object": "chat.completion",
  "created": 1709608505,
  "model": "gpt-3.5-turbo-0125",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The meaning of life is a deep and complex philosophical question that has been debated for centuries. Different people and cultures have different interpretations and beliefs about the meaning of life. Some believe that it is about finding happiness and fulfillment, others believe it is about serving a higher purpose or spiritual journey. Ultimately, the meaning of life is a deeply personal question that each individual must explore and define for themselves."
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 78,
    "total_tokens": 103
  },
  "system_fingerprint": "fp_b9d4cef803"
};

/**
 * Fetch that defaults to an easy json experience.
 * @todo I'm not implementing all of axios right now.
 * @param {string} url - The url to fetch from
 * @param {object} options - The options to pass to fetch
 */
export const moxios = async (url, options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

/**
 * Make requests to the ChatGPT API
 */
export class OpenAI {
  constructor() {
    if (OpenAI.instance) {
      return OpenAI.instance;
    }
    // this.apiKey = process.env.OPENAI_API_KEY; // @todo fix bc did an api key push issue workaround
    this.urls = {
      completions: 'https://api.openai.com/v1/chat/completions'
    };
    OpenAI.instance = this;
  }
  /**
   * Gets a message from the ChatGPT API
   */
  async fetchChatbotReply(userMessage) {
    // Workaround bc can't publish api key
    if (process.env.OPENAI_API_KEY === null) {
      return 'SEE THE SUBMISSION. ADD API KEY VIA CONSOLE!/n' + sampleResponse.choices[0].message.content;
    }

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful, funny, sarcastic chatbot." },
            // { role: "user", content: "What is the meaning of life?" },
            { role: "user", content: userMessage }
          ],
          max_tokens: 50
        })
      };
      // const data = sampleResponse;
      const data = await moxios(this.urls.completions, options);
      return data.choices[0].message.content;
    }

    catch (error) {
      throw error; // K.I.S.S. for now. @todo
    }

  }
}