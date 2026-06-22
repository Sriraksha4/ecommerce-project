const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateDescription = async (req, res) => {
  try {
    const { productName } = req.body;

    console.log("Generating description for:", productName);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Generate a professional e-commerce product description for: ${productName}`,
        },
      ],
    });

    const description = response.choices[0].message.content;

    res.status(200).json({
      success: true,
      productName,
      description,
    });

  } catch (error) {
    console.log("FULL ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateDescription,
};