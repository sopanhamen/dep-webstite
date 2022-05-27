import VideoPlayer from '@shared/components/video/video-player';
import { MVideo } from '@shared/models/image-model';
import { ToastServices } from '@shared/services/toast.service';
import { AxiosResponse } from 'axios';
import clsx from 'clsx';
import _ from 'lodash';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import CommonServices from 'store/services/common.service';

interface IUploadVideo {
  children?: ReactNode;
  videoData(value: MVideo): void;
  videoSrc?: string;
  label?: string;
  className?: string;
  classPrefix?: string;
  disabled?: boolean;
  durationToValidate?: number;
}

function UploadVideo({
  children,
  videoData,
  videoSrc,
  label = 'Upload Video',
  className,
  classPrefix,
  disabled = false,
  durationToValidate = 60,
}: IUploadVideo) {
  const ac = new AbortController();

  // states section
  const [debounceVideo, setDebounceVideo] = useState<File[]>([]);
  const [isValidVideo, setIsValidVideo] = useState(true);

  // hooks section
  useEffect(() => {
    if (!debounceVideo?.length) return;
    if (!isValidVideo) return ToastServices.error('Video is too long!');
    CommonServices.uploadVideos(debounceVideo).then((res: AxiosResponse) => {
      videoData(new MVideo(res?.data));
    });

    return () => ac.abort();
  }, [debounceVideo]);

  // functions section
  const debounceVideoFnc = _.debounce(setDebounceVideo, 500);

  const readMultiFiles = useCallback((files: File[]) => {
    setDebounceVideo([]);
    const reader = new FileReader();
    const result: File[] = [];

    function readFile(files: File[], index: number) {
      if (index >= files?.length) return;
      const file = files?.[index];

      reader.onload = () => {
        result.push(file);
        readFile(files, index + 1);

        // validated video length
        const audio = new Audio(reader.result as string);
        audio.onloadeddata = () => {
          audio.duration > durationToValidate
            ? setIsValidVideo(false)
            : setIsValidVideo(true);
        };
      };
      reader.readAsDataURL(file);
    }
    readFile(files, 0);
    debounceVideoFnc(result);
  }, []);

  function videoChange(e: any) {
    if (disabled) return;
    e.preventDefault();
    readMultiFiles(e?.target?.files);

    // clear input file
    e.target.value = [];
  }

  return (
    <div
      className={clsx(
        classPrefix && `${classPrefix}-upload-container`,
        className,
      )}
    >
      <input
        type="file"
        id="upload-video"
        onChange={videoChange}
        hidden
        accept="video/mp4,video/x-m4v,video/*"
        className={clsx()}
        disabled={disabled}
      />

      <label
        htmlFor="upload-video"
        className={clsx(classPrefix && `${classPrefix}-upload-label-for`)}
      >
        {children ?? (
          <>
            {videoSrc ? (
              <VideoPlayer
                src={videoSrc}
                className={clsx(
                  classPrefix && `${classPrefix}-upload-image`,
                  'media-upload--container__has-video',
                  disabled && 'disabled-select',
                )}
              />
            ) : (
              <div
                className={clsx(
                  'media-upload--container__no-video',
                  classPrefix && `${classPrefix}-upload-label-container`,
                  disabled && 'disabled-select',
                )}
              >
                <p
                  className={clsx(classPrefix && `${classPrefix}-upload-label`)}
                >
                  {label}
                </p>
              </div>
            )}
          </>
        )}
      </label>
    </div>
  );
}

export default UploadVideo;
