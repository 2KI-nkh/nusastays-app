import React, { useState, useEffect } from 'react';
import { generateVideoWithXAI, pollVideoStatus } from './VideoGenerator';
import VideoPlayer from './VideoPlayer';

function VideoGenerationPanel() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(6);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  // Polling effect
  useEffect(() => {
    if (!requestId || status !== 'processing') {
      return;
    }
    const interval = setInterval(async () => {
      try {
        const { status: newStatus, url } = await pollVideoStatus(requestId, apiKey);
        setStatus(newStatus);
        if (newStatus === 'done' && url) {
          setVideoUrl(url);
          clearInterval(interval);
        } else if (newStatus === 'failed') {
          setError('Generation failed.');
          clearInterval(interval);
        }
      } catch (err) {
        setError(err.message);
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [requestId, status, apiKey]);

  const handleSubmit = async (e) => {
  e.preventDefault();
    setStatus('');
    setRequestId(null);
    setVideoUrl(null);
    setError(null);
    if (!apiKey) {
      setError('Please provide your xAI API key.');
      return;
    }
    try {
      setStatus('processing');
      const result = await generateVideoWithXAI(
        { prompt, duration, aspectRatio },
        apiKey
      );
      setRequestId(result.requestId);
      setStatus(result.status);
    } catch (err) {
      setError(err.message);
      setStatus('');
    }
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            API Key:
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label>
            Prompt:
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ width: '100%' }}
              rows={3}
            />
          </label>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <label>
            Duration (s):
            <input
              type="number"
              min="1"
              max="10"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Aspect ratio:
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
              <option value="16:9">16:9</option>
              <option value="1:1">1:1</option>
              <option value="9:16">9:16</option>
              <option value="4:3">4:3</option>
            </select>
          </label>
        </div>
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Generate Video
        </button>
      </form>
      {status && <p>Status: {status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <VideoPlayer videoUrl={videoUrl} />
    </div>
  );
}

export default VideoGenerationPanel;
