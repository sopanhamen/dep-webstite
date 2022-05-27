import { useRouter } from 'next/router';
import React from 'react';

interface ICMSPageTitleProps {
  title?: string;
  hasBackIcon?: boolean;
  onClickBackIcon?: () => void;
}

export default function CmsPageTitle({
  title,
  hasBackIcon = false,
  onClickBackIcon,
}: ICMSPageTitleProps) {
  const router = useRouter();

  return (
    <div className="center">
      {hasBackIcon && (
        <i
          className="fa fa-arrow-left cms-page-back-icon"
          aria-hidden="true"
          onClick={() => {
            onClickBackIcon ? onClickBackIcon() : router.back();
          }}
        />
      )}
      <h1 className="cms-page-title">{title}</h1>
    </div>
  );
}
