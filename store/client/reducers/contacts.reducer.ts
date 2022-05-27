import * as type from '../actions/root.action-types';

export interface ContactState {
  form: string;
  isRequesting: boolean;
}

const initialStates: ContactState = {
  form: '',
  isRequesting: false,
};

const ContactsReducer = (state = initialStates, action: any) => {
  switch (action.type) {
    case type.CONTACTS_REQUEST:
      state.isRequesting = true;
      return {
        ...state,
      };
    case type.CONTACTS_SUCCESS:
      (state.isRequesting = false), (state.form = action.form);
      return {
        ...state,
      };
    case type.CONTACTS_FAILED:
      state.isRequesting = false;
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default ContactsReducer;
