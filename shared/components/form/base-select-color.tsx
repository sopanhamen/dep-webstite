import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { ColorResult, RGBColor, SketchPicker } from 'react-color';

interface IBaseSelectColor {
  onChange: (color: string) => void;
  value: string;
  disabled?: boolean;
  helperText?: string;
}

function BaseSelectColor(props: IBaseSelectColor) {
  const { onChange, value, helperText, disabled } = props;
  const ac = new AbortController();
  // states section
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [background, setBackground] = useState<
    Partial<ColorResult> & Partial<RGBColor>
  >();
  const [colors, setColors] = useState<
    Partial<ColorResult> & Partial<RGBColor>
  >({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });

  useEffect(() => {
    setColors({ hex: value });
    setBackground({ hex: value });
    return () => {
      ac.abort();
    };
  }, [value]);

  // function section
  const handleClick = () => {
    if (disabled) return;
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    if (disabled) return;
    setDisplayColorPicker(false);
  };

  const handleChange = (color: ColorResult) => {
    if (disabled) return;
    setColors(color);
    setBackground(color);
  };

  const handleChangeComplete = (color: ColorResult) => {
    if (disabled) return;
    onChange(color.hex);
  };

  return (
    <div>
      <div className="react-color--container">
        <label>Color</label>
        <div
          className={clsx(
            'react-color--container__sketch',
            disabled && 'disabled-select',
          )}
          onClick={handleClick}
        >
          <div
            className="react-color--container__sketch__box-color"
            style={{
              background: background?.hex
                ? `${background?.hex}`
                : `rgba(
            ${background?.rgb?.r},
            ${background?.rgb?.g},
            ${background?.rgb?.b},
            ${background?.rgb?.a})`,
            }}
          />
        </div>
        {displayColorPicker ? (
          <div className="react-color--container__popover">
            <div
              className="react-color--container__cover"
              onClick={handleClose}
            />
            <SketchPicker
              color={colors?.hex && colors?.rgb}
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
            />
          </div>
        ) : null}
      </div>
      {helperText ? (
        <Form.Text className="error-text">{helperText}</Form.Text>
      ) : null}
    </div>
  );
}

export default BaseSelectColor;
