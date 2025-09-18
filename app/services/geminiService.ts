import { createCompositeImageBase64 } from "../utils/canvasUtils";
import { fileToBase64 } from "../utils/fileUtils";

/**
 * Analyzes the style of a logo image.
 * @param logoFile The logo image file.
 * @returns A promise that resolves to a string describing the logo's style.
 */
export const analyzeLogoStyle = async (logoFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);

    const response = await fetch('/api/analyze-logo', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to analyze logo");
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.analysis;
  } catch (error) {
    console.error("Error analyzing logo style:", error);
    throw new Error("ERROR_ANALYSIS_FAILED");
  }
};

/**
 * Generates a virtual background by pre-placing the logo on a canvas and having the AI
 * fill in the rest of the scene.
 * @param logoFile The logo image file.
 * @param logoAnalysis A description of the logo's style.
 * @param selectedStyle The desired style for the background.
 * @param dimension The desired dimension (2D or 3D).
 * @param keywords Optional user-provided keywords for thematic guidance.
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const generateVirtualBackground = async (
  logoFile: File,
  logoAnalysis: string,
  selectedStyle: string,
  dimension: '2D' | '3D',
  keywords: string
): Promise<string> => {
  try {
    const compositeImageBase64 = await createCompositeImageBase64(logoFile);

    const response = await fetch('/api/generate-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        compositeImageBase64,
        logoAnalysis,
        selectedStyle,
        dimension,
        keywords,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate background");
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.imageBase64;

  } catch (error) {
    console.error("Error generating virtual background:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
      throw new Error("ERROR_SAFETY_BLOCK");
    }
    throw new Error("ERROR_GENERATION_FAILED");
  }
};
