import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

interface IModificationModal {
  backdrop?: 'static' | true | false;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  dialogClassName?: string;
  hint?: string;
  isShow: boolean;
  size?: 'xl' | 'lg' | 'sm';
  title: string;
  onClose: () => void;
}

interface IModificationFooter {
  className?: string;
  style?: Object;
  children?: ReactNode;
}

function ModificationModal(props: IModificationModal) {
  const {
    backdrop = 'static',
    children,
    className,
    contentClassName,
    dialogClassName,
    hint,
    isShow,
    size = 'xl',
    title,
    onClose,
  } = props;

  const renderTooltip = (val: any) => (
    <Tooltip {...val}>
      <p>{hint}</p>
    </Tooltip>
  );

  return (
    <Modal
      className={clsx('modification-modal', className)}
      contentClassName={clsx(contentClassName)}
      show={isShow}
      onHide={onClose}
      centered
      dialogClassName={dialogClassName}
      backdrop={backdrop}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="border-0 text-center" closeButton>
        <Modal.Title className="w-100 center gap-10">
          <h5 className="font-w-500 color-blue">{title}</h5>
          {hint && (
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <i className="fa fa-info-circle color-blue" aria-hidden="true" />
            </OverlayTrigger>
          )}
        </Modal.Title>
      </Modal.Header>
      {children}
    </Modal>
  );
}

// eslint-disable-next-line react/display-name
ModificationModal.Body = ({
  children,
  className,
  style,
}: IModificationFooter) => {
  return (
    <div className={clsx('modal-body p-5', className)} style={style}>
      {children}
    </div>
  );
};

// eslint-disable-next-line react/display-name
ModificationModal.Footer = ({
  children,
  className,
  style,
}: IModificationFooter) => {
  return (
    <div
      className={clsx(
        'modal-footer d-flex justify-content-center px-5',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default ModificationModal;
