# Virtual Office Background Generator

Generate professional virtual backgrounds for video calls that match your brand identity using AI.

## Features

- **Logo Analysis**: AI analyzes your logo's style, colors, and branding aesthetic
- **Smart Background Generation**: Creates professional virtual office backgrounds that complement your brand
- **Multiple Styles**: Choose between photorealistic and cartoon styles
- **2D/3D Options**: Select flat graphical or realistic depth designs
- **Keyword Guidance**: Add optional keywords to guide the theme
- **Virtual Try-On**: Test backgrounds with your camera using real-time segmentation
- **Multi-language**: Available in English and Spanish

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Camera Segmentation**: MediaPipe SelfieSegmentation
- **Deployment**: Optimized for Vercel

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add the environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
4. Deploy!

## Architecture

The application has been refactored from a client-side React app to a Next.js application with:

- **Server-side API routes**: All AI operations using API keys are handled on the server
- **Client-side canvas operations**: Logo composition remains on the frontend for Vercel compatibility
- **Optimized for Edge Runtime**: Efficient serverless deployment on Vercel

## API Routes

- `/api/analyze-logo`: Analyzes the logo style using Gemini
- `/api/generate-background`: Generates the virtual background using the composite image

## Made with 💜 by [FenixBlack.ai](https://www.fenixblack.ai)