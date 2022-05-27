/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { ICON_URL } from '@shared/constant';
import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import BaseImage from '../images/base-image';

interface IAdminTableImgProps {
  alt?: string;
  height?: number;
  layout?: 'fill' | 'fixed' | 'intrinsic' | 'responsive' | undefined;
  src?: string;
  width?: number;
}

export default function AdminTableImg({
  alt,
  height = 250,
  layout = 'fixed',
  src,
  width = 250,
}: IAdminTableImgProps) {
  const popover = (
    <Popover>
      <Popover.Body className="app-table-img-popover-wrapper">
        <BaseImage
          alt={alt}
          className="app-table-img-popover"
          height={height}
          layout={layout}
          src={src ?? ICON_URL.BROKEN}
          width={width}
        />
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger
        placement="right"
        trigger={['hover', 'focus']}
        overlay={popover}
      >
        <span className="app-table-img-wrapper">
          <BaseImage
            className="app-table-img"
            src={src || ICON_URL.BROKEN}
            alt={alt}
            width={50}
            height={50}
            layout="fixed"
          />
        </span>
      </OverlayTrigger>
    </>
  );
}
