import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const logoFile = formData.get('logo') as File;
    
    if (!logoFile) {
      return NextResponse.json(
        { error: 'No logo file provided' },
        { status: 400 }
      );
    }

    const bytes = await logoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { 
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: logoFile.type,
            },
          },
          { text: "Analyze the provided logo image. Describe its visual style, color palette, shapes, and overall branding aesthetic in a concise paragraph. This description will be used to generate a matching virtual background." }
        ]
      },
    });

    // Check if response has the text property
    const analysisText = response.text;
    if (!analysisText) {
      throw new Error("Failed to get analysis from Gemini.");
    }

    return NextResponse.json({ analysis: analysisText });
  } catch (error) {
    console.error("Error analyzing logo style:", error);
    return NextResponse.json(
      { error: 'ERROR_ANALYSIS_FAILED' },
      { status: 500 }
    );
  }
}
