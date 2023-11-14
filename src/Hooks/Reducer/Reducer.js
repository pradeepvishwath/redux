import React from "react";
// import Action from "../Reducer/Action";
import { ActionTypes } from '../Reducer/Action';
export const initialState = {
  firstName: "",
  firstNameError: "",
  email: "",
  emailError: "",
  phone: "",
  phoneError: "",
  password: "",
  passwordError: "",
  cpassword: "",
  cpasswordError: "",
  gender: "",
  genderError: "",
  language: "",
  languageError: "",
  dob: "",
  dobError: "",
  id: "",
  loading: true,
  isEditing: false,
  errors: {},
};
export const Reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_FIELD:
      return { ...state, [action.fieldName]: action.fieldValue };
    case ActionTypes.SET_ERROR:
      return { ...state, [action.errorName]: action.errorValue };
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.value };
    case ActionTypes.SET_ID:
      return { ...state, id: action.value };
    case ActionTypes.SET_EDITING:
      return { ...state, isEditing: action.value };

    case ActionTypes.SET_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
};