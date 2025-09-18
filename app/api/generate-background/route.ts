import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { compositeImageBase64, logoAnalysis, selectedStyle, dimension, keywords } = body;

    if (!compositeImageBase64 || !logoAnalysis || !selectedStyle || !dimension) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const compositeImagePart = {
      inlineData: {
        data: compositeImageBase64,
        mimeType: 'image/png',
      },
    };
    
    const dimensionInstruction =
      dimension === '3D'
        ? 'Create a realistic sense of depth. The background should feel like a real space with a clear foreground and background. Use soft focus or depth of field effects where appropriate.'
        : 'The design should be flat and graphical. Avoid realistic shadows, gradients, or perspective that creates a 3D effect. Think of it as a vector-style illustration.';

    // Map style to appropriate output instruction
    let styleOutputInstruction = '';
    switch(selectedStyle) {
      case 'Cozy':
        styleOutputInstruction = 'Create a cozy background with warm, home-like spaces that make you feel approachable and relaxed.';
        break;
      case 'Professional':
        styleOutputInstruction = 'Create a professional background with clean and polished look for formal meetings and business calls.';
        break;
      case 'Natural':
        styleOutputInstruction = 'Create a natural background with fresh greenery and soft light that bring a calming, outdoor vibe.';
        break;
      case 'Futuristic':
        styleOutputInstruction = 'Create a futuristic background with sleek tech environments, modern lines, lights, and innovation vibes.';
        break;
      case 'Creative':
        styleOutputInstruction = 'Create a creative background with bold colors, artistic shapes, or playful cartoon styles that stand out.';
        break;
      case 'Urban':
        styleOutputInstruction = 'Create an urban background with modern lofts, city skylines, or coworking vibes with an energetic tone.';
        break;
      case 'Elegant':
        styleOutputInstruction = 'Create an elegant background with classic interiors, bookshelves, wood, or refined architectural details.';
        break;
      case 'Abstract':
        styleOutputInstruction = 'Create an abstract background with soft gradients and simple geometric patterns that look stylish yet neutral.';
        break;
      default:
        styleOutputInstruction = 'Create a professional virtual background that matches the chosen style.';
    }
    
    const themeInstruction = keywords
      ? `**Thematic Elements:** The background should subtly incorporate themes related to the following keywords: "${keywords}". For example, if the keywords are "sustainable tech", you could include eco-friendly elements, green technology visuals, or renewable energy motifs.`
      : 'The background should be a general, professional office environment that complements the logo and chosen style.';

    const prompt = `
      You are an expert virtual background designer. You are given a 16:9 image that contains a brand logo placed in a corner as a starting suggestion.

      **Your Task:** Creatively design a complete, professional virtual office background using this logo.

      **Instructions:**
      1.  **Creative Freedom:** You have the creative freedom to move the provided logo from its initial position to a new, more aesthetically pleasing and natural location, such as on a wall or a screen within the virtual office.
      2.  **CRITICAL - Logo Integrity:** While you can move the logo, you must NOT alter, distort, crop, or change its colors. It must be rendered perfectly, exactly as provided.
      3.  **Recommended Placement:** For practical use in video calls, the logo should ideally be placed in the top-left or top-right quadrant of the final image.
      4.  **Aesthetic & Style:**
          *   The background's aesthetic must match the logo's style ("${logoAnalysis}").
          *   ${styleOutputInstruction}
          *   ${themeInstruction}
          *   **Dimension:** ${dimensionInstruction}
          *   **Professionalism:** The scene must be clean, uncluttered, and professional. Avoid overly busy or distracting elements.
      5.  **Output:**
          *   Generate ONLY the final, complete 16:9 image. Do not include any text, just the finished visual.
    `;

    const textPart = { text: prompt };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [compositeImagePart, textPart] },
      config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });
    
    // Check if response has candidates and content
    if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts) {
      throw new Error("ERROR_NO_IMAGE_RETURNED");
    }
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
        return NextResponse.json({ imageBase64: part.inlineData.data });
      }
    }

    throw new Error("ERROR_NO_IMAGE_RETURNED");

  } catch (error) {
    console.error("Error generating virtual background:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
      return NextResponse.json(
        { error: 'ERROR_SAFETY_BLOCK' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'ERROR_GENERATION_FAILED' },
      { status: 500 }
    );
  }
}