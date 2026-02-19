// VideoGenerator.jsx
// Utility functions to interface with xAI Grok Imagine video API.
// See https://docs.x.ai/developers/model-capabilities/video/generation for details.

export async function generateVideoWithXAI({ prompt, duration = 10, aspectRatio = '16:9', mode = 'text-to-video', inputImage }, apiKey) {
  // Build payload according to the current xAI API spec.
  const payload = {
    model: 'grok-imagine-video',
    prompt,
    duration: Math.min(duration, 10),
    aspect_ratio: aspectRatio,
    resolution: '720p'
  };
  if (mode === 'image-to-video' && inputImage) {
    payload.image_url = inputImage;
  }
  const response = await fetch('https://api.x.ai/v1/videos/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Failed to generate video: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return {
    requestId: data.request_id || data.id,
    status: data.status
  };
}

export async function pollVideoStatus(requestId, apiKey) {
  const response = await fetch(`https://api.x.ai/v1/videos/${requestId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch video status: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return {
    status: data.status,
    url: data.status === 'done' ? data.video?.url : null
  };
}
