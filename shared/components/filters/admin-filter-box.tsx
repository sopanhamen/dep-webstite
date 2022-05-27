import { ICommonElementProps } from '@shared/interfaces';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';

interface IAdminFilterBoxProps {
  forAdmin?: boolean;
  isShow?: boolean;
  hasAdvance?: boolean;
  children?: React.ReactNode;
}

interface IAdminFilterBoxBasicProps extends ICommonElementProps {}

export default function AdminFilterBox({
  forAdmin = true,
  isShow,
  children,
}: IAdminFilterBoxProps) {
  return (
    <>
      {forAdmin && <hr className="break-line" />}
      <Collapse in={isShow}>
        <section className={`${forAdmin ? 'bg-concrete' : ''}`}>
          <div className={`${forAdmin ? 'p-3' : ''} pe-0 ctrl-pb`}>
            <div
              className={`${forAdmin ? 'pe-3' : ''}`}
              style={
                forAdmin
                  ? {
                      maxHeight: '320px',
                      overflowX: 'hidden',
                      overflowY: 'auto',
                    }
                  : undefined
              }
            >
              {children}
            </div>
          </div>
        </section>
      </Collapse>
      {forAdmin && <hr className="break-line ctrl-mb" />}
    </>
  );
}

AdminFilterBox.Basic = ({ children }: IAdminFilterBoxBasicProps) => (
  <div>{children}</div>
);

AdminFilterBox.Advance = ({
  children,
  forAdmin = true,
}: IAdminFilterBoxBasicProps) => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);

  return (
    <div>
      <div
        className="d-inline-block color-link text-nowrap cursor-pointer fw-bold mt-2"
        onClick={() => setIsShow(!isShow)}
      >
        <i
          className="fa fa-angle-double-right me-2 mt-2"
          aria-hidden="true"
        ></i>
        {t('common:filter.advanced_filters')}
      </div>
      <br />
      <Collapse in={isShow}>
        <section
          className="ctrl-radius"
          style={forAdmin ? { backgroundColor: '#fbfbfb' } : undefined}
        >
          <div className={`${forAdmin ? 'p-3' : ''} mt-2`}>{children}</div>
        </section>
      </Collapse>
    </div>
  );
};

AdminFilterBox.Row = ({ children }: IAdminFilterBoxBasicProps) => (
  <div className="row g-3">{children}</div>
);

AdminFilterBox.Col = ({ children }: IAdminFilterBoxBasicProps) => (
  <div className="col-md-6">{children}</div>
);

AdminFilterBox.ColFull = ({ children }: IAdminFilterBoxBasicProps) => (
  <div className="col-md-12">{children}</div>
);
