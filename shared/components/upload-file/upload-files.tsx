import BaseImage from '@shared/components/images/base-image';
import { MDocument } from '@shared/models/image-model';
import clsx from 'clsx';
import _ from 'lodash';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import CommonService from 'store/services/common.service';

interface IUploadFiles {
  children?: ReactNode;
  fileData(value: MDocument | MDocument[]): void;
  fileSrc?: string;
  fileName?: string;
  label?: string;
  className?: string;
  classPrefix?: string;
  disabled?: boolean;
  id?: string | number;
  multiple?: boolean;
  acceptFile?: string;
}

function UploadFiles(props: IUploadFiles) {
  const {
    children,
    fileData,
    fileSrc,
    fileName,
    label = 'Upload Image',
    className,
    classPrefix,
    disabled = false,
    multiple,
    id = Date.parse(`${new Date()}`),
    acceptFile,
  } = props;
  const ac = new AbortController();

  // states section
  const [debounceImages, setDebounceImages] = useState<File[]>([]);

  // hooks section
  useEffect(() => {
    if (!debounceImages?.length) return;
    if (multiple) {
      CommonService.uploadFiles(debounceImages).then((res: any) => {
        fileData(res?.data?.map((e: any) => new MDocument(e)));
      });
    } else {
      CommonService.uploadFile(debounceImages[0]).then((res: any) => {
        fileData(new MDocument(res?.data));
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

  function fileChanged(e: any) {
    if (disabled) return;
    e.preventDefault();
    readMultiFiles(e.target.files);
  }

  return (
    <div
      className={clsx(
        'upload-file-container',
        classPrefix && `${classPrefix}-upload-container`,
        className,
      )}
    >
      <input
        type="file"
        id={`upload-file-${id}`}
        onChange={fileChanged}
        hidden
        accept={acceptFile}
        className={clsx()}
        disabled={disabled}
        multiple={multiple}
      />

      <label
        htmlFor={`upload-file-${id}`}
        className={clsx(classPrefix && `${classPrefix}-upload-label-for`)}
      >
        {children ?? (
          <>
            {fileName ? (
              <div
                className={clsx(
                  classPrefix && `${classPrefix}-upload-image`,
                  'media-upload--container__has-file',
                  disabled && 'disabled-select',
                )}
              >
                <p>{fileName}</p>
              </div>
            ) : (
              <div
                className={clsx(
                  'media-upload--container__no-file',
                  classPrefix && `${classPrefix}-upload-label-container`,
                  className,
                  disabled && 'disabled-select',
                )}
              >
                <p
                  className={clsx(classPrefix && `${classPrefix}-upload-label`)}
                >
                  {'Choose File' || label}
                </p>
              </div>
            )}
          </>
        )}
      </label>
    </div>
  );
}

export default UploadFiles;
