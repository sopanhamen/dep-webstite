import BaseImage from '@shared/components/images/base-image';
import React from 'react';

interface IFlagBadge {
  src: string;
}

function FlagBadge({ src }: IFlagBadge) {
  return (
    <div className="badge-flag">
      <BaseImage src={src} width={20} height={20} sizes="small" alt="img" />
    </div>
  );
}

export default FlagBadge;
