import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateSvgCode = async (prompt: string): Promise<string> => {
  const client = getAiClient();
  
  const fullPrompt = `
    You are an expert SVG artist and coder.
    Task: Generate raw SVG code for the following description: "${prompt}".
    
    Constraints:
    1. Output ONLY the raw <svg>...</svg> code. 
    2. Do not include markdown formatting (no \`\`\`xml or \`\`\` tags).
    3. Ensure the SVG is responsive (viewBox set, width/height 100% or omitted if viewBox exists).
    4. Use vibrant colors and clean paths.
    5. Make it detailed but optimized.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    let text = response.text || '';
    
    // Cleanup if model accidentally includes markdown
    text = text.replace(/```xml/g, '').replace(/```/g, '').trim();
    
    // Ensure it starts with <svg
    const svgStartIndex = text.indexOf('<svg');
    const svgEndIndex = text.lastIndexOf('</svg>');
    
    if (svgStartIndex !== -1 && svgEndIndex !== -1) {
      return text.substring(svgStartIndex, svgEndIndex + 6);
    }

    return text;
  } catch (error) {
    console.error("Error generating SVG:", error);
    throw new Error("Failed to generate SVG. Please try again.");
  }
};
