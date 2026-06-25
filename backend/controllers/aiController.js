const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

const generateDescription = async (req, res) => {
  try {
    const { productName, features, specifications, targetAudience } = req.body;

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    console.log("Generating AI description for:", productName);

    const prompt = `You are a professional e-commerce copywriter. Generate detailed, premium product page content for:
Product Name: ${productName}
Features: ${features || "Not specified"}
Specifications: ${specifications || "Not specified"}
Target Audience: ${targetAudience || "General Public"}

Please generate the content in the following structured JSON format:
{
  "description": "A compelling, professional e-commerce product description tailored to the target audience.",
  "seoDescription": "A search-engine optimized meta description (150-160 characters) with keywords.",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "bulletPoints": ["Key benefit/feature bullet point 1", "Key benefit/feature bullet point 2", "Key benefit/feature bullet point 3"]
}

Return ONLY the raw JSON string. Do not wrap in markdown \`\`\`json block. Just the raw JSON object.`;

    let generatedText = "";
    let parsedResult = null;

    // Try Gemini first if key is present
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log("Using Google Gemini API...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        generatedText = response.text();
      } catch (geminiError) {
        console.warn("Gemini generation failed, falling back to Groq:", geminiError.message);
      }
    }

    // Fallback to Groq if Gemini failed or was not configured
    if (!generatedText && process.env.GROQ_API_KEY) {
      try {
        console.log("Using Groq SDK...");
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const response = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });
        generatedText = response.choices[0].message.content;
      } catch (groqError) {
        console.error("Groq generation also failed:", groqError.message);
      }
    }

    if (!generatedText) {
      throw new Error("Both Gemini and Groq generations failed or keys are missing.");
    }

    // Try to parse JSON output
    try {
      // Strip markdown code block wrappers if any
      let cleanText = generatedText.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.substring(7);
      }
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      parsedResult = JSON.parse(cleanText.trim());
    } catch (parseError) {
      console.warn("Failed to parse JSON from generator, returning text wrapped in object:", parseError.message);
      parsedResult = {
        description: generatedText,
        seoDescription: `${productName} - premium product available now.`,
        highlights: [productName],
        bulletPoints: [productName]
      };
    }

    res.status(200).json({
      success: true,
      productName,
      data: parsedResult
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateDescription,
};