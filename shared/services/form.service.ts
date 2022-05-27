import * as _ from 'lodash';

export const FormService = {
  getErrorMessage: (
    errors: any,
    key: string,
    label: string,
    message?: string,
  ) => {
    const type = _.get(errors, `${key}.type`);
    if (!type) return;
    switch (type) {
      case 'required':
        return `${label} is required`;
      case 'minLength':
        return message || `${label} should contain 8 characters`;
      case 'maxLength':
        return message || `${label} should contain 8 characters`;
      case 'pattern':
        return message || `${label} is invalid`;
      case 'manual':
        return `${errors?.[key].message}`;
      case 'min':
        return message || `${label} cannot be less than 0`;
      case 'max':
        return message || `${label} cannot be greater than 100`;
      case 'validate':
        return errors[key]?.message || message;

      default:
        return '';
    }
  },
};
