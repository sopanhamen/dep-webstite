import clsx from 'clsx';
import React from 'react';
import ReactPlayer from 'react-player';

interface IVideoPlayer {
  src: string;
  className?: string;
}

// https://github.com/cookpete/react-player
function VideoPlayer({ src, className }: IVideoPlayer) {
  return (
    <ReactPlayer
      controls
      className={clsx(className)}
      url={src}
      width="100%"
      height="100%"
    />
  );
}

export default VideoPlayer;
