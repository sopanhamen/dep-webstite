import BaseImage from '@shared/components/images/base-image';
import { MImage } from '@shared/models/image-model';
import clsx from 'clsx';
import _ from 'lodash';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import CommonService from 'store/services/common.service';

interface IUploadImage {
  children?: ReactNode;
  imageData(value: MImage | MImage[]): void;
  imageSrc?: string;
  imageAlt?: string;
  label?: string;
  className?: string;
  classPrefix?: string;
  disabled?: boolean;
  id?: string | number;
  multiple?: boolean;
}

function UploadImages({
  children,
  imageData,
  imageSrc,
  imageAlt,
  label = 'Upload Image',
  className,
  classPrefix,
  disabled = false,
  multiple,
  id = Date.parse(`${new Date()}`),
}: IUploadImage) {
  const ac = new AbortController();

  // states section
  const [debounceImages, setDebounceImages] = useState<File[]>([]);

  // hooks section
  useEffect(() => {
    if (!debounceImages?.length) return;
    if (multiple) {
      CommonService.uploadImages(debounceImages).then((res: any) => {
        imageData(res?.data?.map((e: any) => new MImage(e)));
      });
    } else {
      CommonService.uploadImage(debounceImages[0]).then((res: any) => {
        imageData(new MImage(res?.data));
      });
    }

    return () => {
      ac.abort();
    };
  }, [debounceImages]);

  // functions section
  const debounceImagesFnc = _.debounce(setDebounceImages, 500);

  const readMultiFiles = useCallback((files: File[]) => {
    setDebounceImages([]);
    const reader = new FileReader();
    const result: File[] = [];

    function readFile(files: File[], index: number) {
      if (index >= files?.length) return;
      const file = files?.[index];

      reader.onload = (e) => {
        result.push(file);
        readFile(files, index + 1);
      };
      reader.readAsDataURL(file);
    }
    readFile(files, 0);
    debounceImagesFnc(result);
  }, []);

  function imageChanged(e: any) {
    if (disabled) return;
    e.preventDefault();
    readMultiFiles(e.target.files);

    // clear input file
    e.target.value = [];
  }

  return (
    <div
      className={clsx(
        'upload-image-container',
        classPrefix && `${classPrefix}-upload-container`,
        className,
      )}
    >
      <input
        type="file"
        id={`upload-image-${id}`}
        onChange={imageChanged}
        hidden
        accept=".png, .jpeg, .jpg"
        className={clsx()}
        disabled={disabled}
        multiple={multiple}
      />

      <label
        htmlFor={`upload-image-${id}`}
        className={clsx(classPrefix && `${classPrefix}-upload-label-for`)}
      >
        {children ?? (
          <>
            {imageSrc ? (
              <BaseImage
                src={imageSrc}
                alt={imageAlt}
                width={150}
                height={150}
                className={clsx(
                  classPrefix && `${classPrefix}-upload-image`,
                  'media-upload--container__has-img',
                  disabled && 'disabled-select',
                )}
              />
            ) : (
              <div
                className={clsx(
                  'media-upload--container__no-img',
                  classPrefix && `${classPrefix}-upload-label-container`,
                  className,
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

export default UploadImages;
