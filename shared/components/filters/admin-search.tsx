import React, { useEffect, useState } from 'react';
import { distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subscriber, Subscription } from 'rxjs';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';

interface IAdminSearchData {
  text: string;
}

interface IAdminSearchProps {
  forAdmin?: boolean;
  text?: string;
  placeholder?: string;
  onChangeText?: (data: IAdminSearchData) => void;
  className?: string;
}

export default function AdminSearch({
  forAdmin = true,
  text,
  placeholder = 'common:filter.search',
  onChangeText,
  className,
}: IAdminSearchProps) {
  const { t } = useTranslation();
  const [displayText, setdisplayText] = useState<string | undefined>('');
  const [searchChange, setSearchChange] = useState<Subscriber<any>>();
  const [subScription, setSubScription] = useState<Subscription>();

  useEffect(() => {
    if (!searchChange) {
      const sub = new Observable((observer) => {
        setSearchChange(observer);
      })
        .pipe(distinctUntilChanged())
        .subscribe((txt) => {
          if (onChangeText) onChangeText({ text: (txt + '').trimLeft() });
        });
      setSubScription(sub);
    }

    return () => {
      subScription?.unsubscribe();
    };
  }, []);

  const input = (e: any) => {
    const inputText = e?.target?.value;
    searchChange?.next(inputText);
  };

  useEffect(() => {
    setdisplayText(text);
  }, [text]);

  return (
    <>
      <div
        className={clsx(
          `app-search-${forAdmin ? 'admin' : 'client'} flex-fill`,
          className,
        )}
      >
        <input
          type="text"
          placeholder={t(placeholder)}
          value={displayText}
          onChange={(e) => {
            setdisplayText(e?.target?.value);
          }}
          onInput={(e) => input(e)}
        />
      </div>
    </>
  );
}
