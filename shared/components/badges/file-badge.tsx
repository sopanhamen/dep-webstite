import clsx from 'clsx';
import React from 'react';

enum EExtension {
  JPEG = 'jpeg',
  PNG = 'png',
  AVI = 'avi',
  PDF = 'pdf',
  XLSX = 'xlsx',
}

interface FileIBadge {
  label?: string;
}

const FileBadge = ({ label = 'Badge' }: FileIBadge) => {
  const generatedBackground = () => {
    switch (label) {
      case EExtension.JPEG:
      case EExtension.PNG:
        return 'bg-img-extension';
      case EExtension.AVI:
        return 'bg-vdo-extension';
      case EExtension.PDF:
      case EExtension.XLSX:
        return 'bg-file-extension';
      default:
        return 'bg-warning';
    }
  };

  return (
    <div className={clsx('badge badge-file', generatedBackground())}>
      {label}
    </div>
  );
};

export default FileBadge;
