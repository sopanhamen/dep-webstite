import { Modal } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';

interface IModalPopUp {
  isShow?: boolean;
  title: string;
  closeSelf?: () => void;
  children?: React.ReactNode;
  buttonName?: () => void;
  backdrop?: 'static' | true | false;
}

function ModalPopUp(props: IModalPopUp): JSX.Element {
  const {
    closeSelf,
    isShow,
    title,
    children,
    buttonName,
    backdrop = 'static',
  } = props;

  return (
    <>
      <Modal
        className="modal-popup"
        size="lg"
        contentClassName="p-5"
        show={isShow}
        onHide={closeSelf}
        keyboard={false}
        centered
        backdrop={backdrop}
      >
        <Modal.Header className="justify-content-center border-0" closeButton>
          <Modal.Title className="title-modal">
            <h5 className="font-w-400 color-blue">{title}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    </>
  );
}

export default ModalPopUp;
