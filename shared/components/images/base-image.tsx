import { ICON_URL } from '@shared/constant';
import Image, { ImageProps } from 'next/image';
import React, { useState } from 'react';

function BaseImage(props: ImageProps) {
  const { src, ...rest } = props;
  const [errored, setErrored] = useState(false);

  const checkImageDispaly = (): string => {
    if (src) return String(src);

    if (errored) return ICON_URL.BROKEN;

    return ICON_URL.BROKEN;
  };

  return (
    <Image
      {...rest}
      src={checkImageDispaly()}
      onError={(e) => setErrored(e?.type === 'error')}
    />
  );
}

export default BaseImage;
