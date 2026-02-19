import React from 'react';

function VideoPlayer({ videoUrl }) {
  if (!videoUrl) {
    return null;
  }
  return (
    <div style={{ marginTop: '1rem' }}>
      <video controls width="100%" src={videoUrl}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
