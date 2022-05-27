import BaseImage from '@shared/components/images/base-image';
import { ICON_URL } from '@shared/constant';
import { MFileImport } from '@shared/models/common.model';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import CommonServices from 'store/services/common.service';

interface IButtonImport {
  id: string;
  acceptFiles?: string;
  className?: string;
  title?: string | JSX.Element;
  disabled?: boolean;
  fileData?: (file: MFileImport) => void;
}

function ButtonImport({
  acceptFiles = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  id,
  className,
  title = 'XLS/CSV upload',
  disabled = false,
  fileData,
}: IButtonImport) {
  const [isDisabled, setIsDisabled] = useState(false);
  const ac = new AbortController();

  useEffect(() => {
    setIsDisabled(disabled);
    return () => {
      ac.abort();
    };
  }, [disabled]);

  function fileChanged(e: any) {
    if (isDisabled) return;
    setIsDisabled(true);
    e.preventDefault();

    const files = e?.target?.files;
    if (files?.length) {
      CommonServices.importFile(files[0])
        .then((res: AxiosResponse) => {
          if (fileData) fileData(res?.data as MFileImport);
          setIsDisabled(false);
        })
        .catch(() => setIsDisabled(false));
    }
  }

  return (
    <div className={className}>
      <label htmlFor={`upload-file-${id}`}>
        <div className="admin-btn-cancel d-flex align-items-center cursor-pointer">
          <BaseImage src={ICON_URL.FILE} width={15} height={15} />
          <span className="ms-2">{title}</span>
        </div>
      </label>
      <input
        type="file"
        id={`upload-file-${id}`}
        onChange={fileChanged}
        hidden
        accept={acceptFiles}
        disabled={isDisabled}
      />
    </div>
  );
}

export default ButtonImport;
