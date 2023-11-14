// For calling OneCompiler for code run
const axios = require('axios');

const XApiKey = process.env.CDEX_KEY;
const XApiHost = process.env.CDEX_HOST;

// Controller function to post a code execution/run attempt to OneCompiler
// USAGE: POST request to http://localhost:3002/api/code/run or
// (For testing third-party only) directly to https://onecompiler-apis.p.rapidapi.com/api/v1/run
exports.runcode = async (req, res) => {
  
  try {
    const code = req.body.code;
    const input = req.body.input;
    const language = req.body.language;
    const fileName = req.body.fileName;

    const upsertPromises = [];

    // Code retrieved from OneCompiler connected via RapidAPI
    const options = {
      method: 'POST',
      url: 'https://onecompiler-apis.p.rapidapi.com/api/v1/run',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': XApiKey,
        'X-RapidAPI-Host': XApiHost,
      },
      data: {
        language: language,
        stdin: input,
        files: [
          {
            name: fileName,
            content: code
          }
        ]
      }
    };
    
    try {
      const response = await axios.request(options);
      upsertPromises.push(Promise.resolve(response.data));
      console.log("result of execution:", response.data);
    } catch (error) {
      upsertPromises.push(Promise.reject(error));
      console.error("error in controller:", error.response.data.message);
    }

    Promise.all(upsertPromises)
      .then((saves) => {
        // Code successfully ran
        res.status(200).send({ message: saves });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });

  } catch (error) {
    // Handle any unexpected errors that occur outside of the Promise chain
    console.log("Run Code Controller Error => " + error);
    res.status(500).send({ message: `req.body value is ${JSON.stringify(req.body)}` });
  }
};
