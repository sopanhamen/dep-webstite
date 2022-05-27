/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Placement } from 'react-bootstrap/esm/types';

interface IAdminOverlayTooltipProps {
  id?: string;
  text?: string;
  placement?: Placement;
  maxWidth?: string;
}

export default function AdminOverlayTooltip({
  id = 'button-tooltip',
  text = '',
  placement = 'bottom',
  maxWidth = '150px',
}: IAdminOverlayTooltipProps) {
  const renderTooltip = (props: any): JSX.Element => (
    <Tooltip id={id} {...props}>
      <p
        className="w-100 height-10"
        dangerouslySetInnerHTML={{
          __html: String(text),
        }}
      />
    </Tooltip>
  );

  return (
    <div className="admin-overlay-tooltip">
      <OverlayTrigger
        placement={placement}
        delay={{ show: 250, hide: 400 }}
        overlay={(a) => renderTooltip(a)}
      >
        <p
          className="truncate"
          style={{ maxWidth: maxWidth }}
          dangerouslySetInnerHTML={{
            __html: String(text),
          }}
        />
      </OverlayTrigger>
    </div>
  );
}
