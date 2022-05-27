import { ELanguage } from '@shared/enum';
import dynamic from 'next/dynamic';
import { Delta } from 'quill';
import { Form } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import RequiredFormIcon from '../form/required-form-icon';

// SOURCE: https://dev.to/a7u/reactquill-with-nextjs-478b
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface IQuill {
  currentValue: string;
  language: ELanguage;
  placeholder?: string;
  updatedValue: (value: string | Delta) => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  isRequired?: boolean;
}

/**
 *
 * @param currentValue - value to be dispalyed on the text editor
 * @param language - an enum of ELanguage
 * @param placeholder - placeholder for the text editor
 * @param updatedValue - returns updated value from the text editor
 */
function Quill({
  language,
  currentValue,
  placeholder,
  updatedValue,
  helperText,
  label = 'Description',
  disabled,
  isRequired = false,
}: IQuill): JSX.Element {
  // Modifying toolbars
  // SOURCE: https://quilljs.com/docs/modules/toolbar/
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['link', 'image'], // add image and embed link
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button
  ];

  const onChange = (value: string | Delta) => {
    if (language === ELanguage.KHMER) {
      // TODO!!! add here the zero-with-space syntax for the khmer language
      updatedValue(value);
    }

    updatedValue(value);
  };

  return (
    <>
      <p className="base-editor-label">
        {
          <>
            {label}
            {isRequired && <RequiredFormIcon />}
          </>
        }
      </p>
      <ReactQuill
        className="base-editor"
        value={currentValue}
        onChange={onChange}
        placeholder={placeholder ?? 'Type your text here'}
        modules={{ toolbar: toolbarOptions }}
        readOnly={disabled}
      />
      <Form.Text className="error-text">{helperText}</Form.Text>
    </>
  );
}

export default Quill;
