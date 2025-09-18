/**
 * Creates a 16:9 canvas, programmatically places the logo in a random top corner,
 * and returns the composite image as a base64 string.
 * This provides a reliable template for the AI to fill in.
 * @param logoFile The user's logo file.
 * @returns A promise that resolves to the base64 string of the composite PNG image.
 */
export const createCompositeImageBase64 = (logoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvasWidth = 1920;
    const canvasHeight = 1080;
    const padding = 60; // Px from edge
    const maxLogoSize = 300; // Max width/height for the logo

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return reject(new Error("Could not get canvas context"));
    }

    // Fill background
    ctx.fillStyle = '#111827'; // bg-gray-900 from Tailwind
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const logo = new Image();
    logo.src = URL.createObjectURL(logoFile);
    logo.onload = () => {
      // Calculate scaled logo dimensions
      const aspectRatio = logo.width / logo.height;
      let logoWidth = maxLogoSize;
      let logoHeight = maxLogoSize;

      if (aspectRatio > 1) { // Wider than tall
        logoHeight = maxLogoSize / aspectRatio;
      } else { // Taller than wide or square
        logoWidth = maxLogoSize * aspectRatio;
      }

      // Randomly choose top-left or top-right
      const position = Math.random() < 0.5 ? 'top-left' : 'top-right';
      
      let x, y;
      if (position === 'top-left') {
        x = padding;
        y = padding;
      } else { // top-right
        x = canvasWidth - logoWidth - padding;
        y = padding;
      }

      ctx.drawImage(logo, x, y, logoWidth, logoHeight);

      URL.revokeObjectURL(logo.src); // Clean up object URL

      const dataUrl = canvas.toDataURL('image/png');
      const base64String = dataUrl.split(',')[1];
      
      if (!base64String) {
        return reject(new Error('Failed to generate base64 string from composite canvas.'));
      }
      
      resolve(base64String);
    };
    logo.onerror = () => {
      reject(new Error('Failed to load the logo image.'));
    }
  });
};
