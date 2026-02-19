# Nusastays App (Minimal Clone)

This is a minimal example of the NusaStays Reel Studio built from scratch to demonstrate video generation using the xAI Grok Imagine API. It includes a simple React application with:

* A `VideoGenerationPanel` component that collects a text prompt, duration, aspect ratio and API key, calls the xAI API, and polls for the result.
* A `VideoGenerator` utility with `generateVideoWithXAI` and `pollVideoStatus` functions.
* A `VideoPlayer` component to display the resulting MP4.

To run this app locally:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Navigate to `http://localhost:3000` in your browser, enter your xAI API key and a prompt, then generate a video.

This project is not a complete clone of the original Base44 app; it is a simplified re‑implementation based on publicly viewable code and documentation.
