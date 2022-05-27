import { FormService } from '@shared/services/form.service';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import BaseInput from '../form/base-input';
import BaseSelect from '../form/base-select-creatable';
import BaseTextArea from '../form/base-textarea';
import ModificationModal from './modification-modal';
import useTranslation from 'next-translate/useTranslation';
import { ALERT_MESSAGE, PATTERNS } from '@shared/constant';
import { EDownloadType } from '@shared/enum';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { APIServices } from '@shared/services/api.service';
import { ToastServices } from '@shared/services/toast.service';
import { downloadBase64 } from '@shared/custom-function/common';

interface IDownloadModalAPIData {
  resourceHubId?: string;
  referenceFileId: string;
  email: string;
  gender: string;
  institution: string;
  purpose: string;
}

interface IDownloadModalData {
  email: string;
  gender: string;
  institution: string;
  purpose: string;
  comment: string;
}

interface IDownloadModalProps {
  isShow: boolean;
  maxCommentChar?: number;
  downloadType: EDownloadType;
  onClose?: () => void;
  getDownloading?: (loading: boolean) => void;

  /*===== props to submit to API =====*/
  itemId: string;
  referenceFileId: string;
  fileId: string;
  filename: string;
  extension: string;
}

const genderOpts = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
  { label: 'Rather not Say', value: 'Rather not Say' },
];

const institutionOpts = [
  { label: 'Academy', value: 'Academy' },
  { label: 'Government', value: 'Government' },
  { label: 'NGO', value: 'NGO' },
  { label: 'Business', value: 'Business' },
  { label: 'Private Sector', value: 'Private Sector' },
  { label: 'Other', value: 'Other' },
];

const purposeOpts = [
  { label: 'Study', value: 'Study' },
  { label: 'Research', value: 'Research' },
  { label: 'General Interest', value: 'General Interest' },
  { label: 'Other', value: 'Other' },
];

const defaultValues: IDownloadModalData = {
  email: '',
  gender: '',
  institution: '',
  purpose: '',
  comment: '',
};

const RESOURCE_HUB_URL = '/resource-hubs/downloads';

export default function DownloadModal({
  isShow = false,
  maxCommentChar = 200,
  downloadType = EDownloadType.RESOURCE_HUB,
  onClose,
  getDownloading,
  itemId, ///id of specific feature, e.g. resourceHubId.
  referenceFileId,
  fileId,
  filename,
  extension,
}: IDownloadModalProps) {
  const { t } = useTranslation();
  const [stateShow, setStateShow] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({ defaultValues });

  const watchComment = watch('comment');

  /*===== Set status of downloading progress =====*/
  const setLoading = (loading: boolean) => {
    getDownloading && getDownloading(loading);
  };

  /*===== Retrieve blob from api and download it =====*/
  const downloadFile = (formData: IDownloadModalData) => {
    onClose && onClose();
    setLoading(true);

    setTimeout(() => {
      APIServices.axiosClientConfig();

      let body: IDownloadModalAPIData = {
        resourceHubId: itemId,
        referenceFileId,
        email: formData?.email,
        gender: formData?.gender,
        institution: formData?.institution,
        purpose: formData?.purpose,
      };

      let url = '';

      /*===== Check URL & itemID base on page/feature (future prevention) =====*/
      switch (downloadType) {
        case EDownloadType.RESOURCE_HUB:
        default:
          body.resourceHubId = itemId;
          url = RESOURCE_HUB_URL;
      }

      axios
        .post(`${url}/${fileId}`, body)
        .then((res: AxiosResponse) => {
          /*===== Waiting for downloading blob file complete =====*/
          downloadBase64(res.data, filename, extension)
            .then(() => {
              setLoading(false);
              ToastServices.success(ALERT_MESSAGE.DOWNLOAD_SUCCESS);

              /*===== Store downloader's info in Cookie =====*/
              document.cookie = `DEP_CLIENT_DWL=${JSON.stringify(formData)}`;
            })
            .catch((err: any) => {
              setLoading(false);
              const msg =
                err?.response?.data?.message ||
                ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
              ToastServices.error(msg);
            });
        })
        .catch((err: AxiosError) => {
          setLoading(false);

          const msg =
            err?.response?.data?.message || ALERT_MESSAGE.UNKNOWN_ERROR_RETRY;
          ToastServices.error(msg);
        });
    }, 1000);
  };

  /*===== 
  * Each time isShow changes to TRUE, 
  * check if exist stored downloader's info, no pop up and download immedietly,
  * else, load a pop up to enter info.
   =====*/
  useEffect(() => {
    if (isShow) {
      const cookies = document.cookie;
      const arr = cookies.split(';');

      let match = arr.find((a) => a.includes('DEP_CLIENT_DWL='));
      if (match) {
        match = match.substring(match.indexOf('{'), match.lastIndexOf('}') + 1);
        const fd = JSON.parse(match);
        downloadFile(fd);

        onClose && onClose();
      } else setStateShow(isShow);
    } else setStateShow(isShow);
  }, [isShow]);

  return (
    <>
      <ModificationModal
        size="lg"
        isShow={stateShow}
        title="Download"
        onClose={() => {
          onClose && onClose();
        }}
        dialogClassName="only-max-width-560"
      >
        <form onSubmit={handleSubmit(downloadFile)}>
          <ModificationModal.Body>
            <Controller
              name="email"
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: PATTERNS.EMAIL,
                  message: 'Email is invalid.',
                },
              }}
              render={({ field: { ref, value, onChange } }: any) => (
                <BaseInput
                  label="Email"
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  helperText={FormService.getErrorMessage(
                    errors,
                    'email',
                    'Email',
                  )}
                  isRequired
                />
              )}
            />

            <Controller
              name="gender"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { ref, value, onChange } }: any) => (
                <BaseSelect
                  label="Gender"
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  helperText={FormService.getErrorMessage(
                    errors,
                    'gender',
                    'Gender',
                  )}
                  options={genderOpts}
                  isMulti={false}
                  isRequired
                />
              )}
            />

            <Controller
              name="institution"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { ref, value, onChange } }: any) => (
                <BaseSelect
                  label="Institution"
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  helperText={FormService.getErrorMessage(
                    errors,
                    'institution',
                    'Institution',
                  )}
                  options={institutionOpts}
                  isMulti={false}
                  isRequired
                />
              )}
            />

            <Controller
              name="purpose"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { ref, value, onChange } }: any) => (
                <BaseSelect
                  label="Purpose"
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  helperText={FormService.getErrorMessage(
                    errors,
                    'purpose',
                    'Purpose',
                  )}
                  options={purposeOpts}
                  isMulti={false}
                  isRequired
                />
              )}
            />

            <Controller
              name="comment"
              control={control}
              render={({ field: { ref, value, onChange } }: any) => (
                <BaseTextArea
                  label="Comment (Optional)"
                  refs={ref}
                  value={value}
                  onChange={onChange}
                  maxLength={200}
                />
              )}
            />
            <div>
              <span className="text-secondary me-2">Characters left:</span>
              {maxCommentChar - (watchComment?.length || 0)}
            </div>
          </ModificationModal.Body>
          <ModificationModal.Footer>
            <Button type="submit" className={`base-btn bg-blue w-100`}>
              {t('common:buttons.submit')}
            </Button>
          </ModificationModal.Footer>
        </form>
      </ModificationModal>
    </>
  );
}
