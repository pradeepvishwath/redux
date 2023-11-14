import React, { useState, useEffect, useReducer } from "react";
import { Form, Button } from "semantic-ui-react";
import {
  API_URL,
  createUser,
  updateuser,
  getUser,
} from "../../../../Service/MockAPI/MockAPI";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaAngleDoubleLeft } from "react-icons/fa";
// import { Reducer, initialState } from "../../../Hooks/Reducer/Reducer";
import { ActionTypes } from "../../../../Hooks/Reducer/Action";
import { ProgressSpinner } from "primereact/progressspinner";
const initialState = {
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
  // isEditing: false,
  isEditing: false,
  errors: {},
};
const Reducer = (state, action) => {
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

export const Workform = () => {
  const navigate = useNavigate();
  const router = useParams();
  const { id } = router;
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!id;

  const {
    firstName,
    firstNameError,
    email,
    emailError,
    phone,
    phoneError,
    password,
    passwordError,
    cpassword,
    cpasswordError,
    gender,
    genderError,
    language,
    languageError,
    dob,
    dobError,

    // isEditing,
    // loading,
  } = state;

  const nameRegex = /^[a-zA-Z ]{3,50}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10}$/;
 
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;

  const dobRegex = /^\d{4}-\d{2}-\d{2}/;

  const handleFieldChange = (fieldName, fieldValue, regex, errorName) => {
    if (!fieldValue) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName,
        errorValue: `${fieldName} is required*`,
      });
    } else if (typeof regex === "function" && !regex(fieldValue)) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName,
        errorValue: `Invalid ${fieldName} format*`,
      });
    } else if (regex instanceof RegExp && !regex.test(fieldValue)) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName,
        errorValue: `Invalid ${fieldName} format*`,
      });
    } else {
      dispatch({ type: ActionTypes.SET_ERROR, errorName, errorValue: "" });
    }
  };

  const getId = async (id) => {
    dispatch({ type: ActionTypes.SET_LOADING, value: true });
    try {
      // const res = await axios.get(API_URL + id);
      const res = await getUser(id);
      dispatch({ type: ActionTypes.SET_DATA, data: res.data });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_DATA, data: initialState });
      toast.error("Error in the GET_ID API", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, value: false });
    }
  };

  useEffect(() => {
    if (id) {
      getId(id); // Fetch user data by 'id'
      dispatch({ type: ActionTypes.SET_ID, value: id });
      dispatch({ type: ActionTypes.SET_EDITING, value: true });
    }
  }, [id]);
  const validateForm = () => {
    let valid = true;

    handleFieldChange("firstName", firstName, nameRegex, "firstNameError");
    handleFieldChange("Email", email, emailRegex, "emailError");
    handleFieldChange("Phone Number", phone, phoneRegex, "phoneError");
    handleFieldChange("Password", password, passwordRegex, "passwordError");

    if (!cpassword) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "cpasswordError",
        errorValue: "Confirm password is required*",
      });
      valid = false;
    } else if (cpassword !== password) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "cpasswordError",
        errorValue: "Passwords do not match*",
      });
      valid = false;
    } else {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "cpasswordError",
        errorValue: "",
      });
    }

    if (!language) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "languageError",
        errorValue: "Please select a language*",
      });
      valid = false;
    } else {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "languageError",
        errorValue: "",
      });
    }

    if (!gender) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "genderError",
        errorValue: "Please select a gender*",
      });
      valid = false;
    } else {
      // dispatch({ type: ActionTypes.SET_ERROR, errorName, errorValue: "" });
      dispatch({ type: ActionTypes.SET_EDITING, value: true });
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "genderError",
        errorValue: "",
      });
    }

    handleFieldChange("Date of Birth", dob, dobRegex, "dobError");

    return valid;
  };
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    dispatch({
      type: ActionTypes.SET_FIELD,
      fieldName: "language",
      fieldValue: selectedLanguage,
    });

    if (!selectedLanguage) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "languageError",
        errorValue: "Please select a language*",
      });
    } else {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "languageError",
        errorValue: "",
      });
    }
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    dispatch({
      type: ActionTypes.SET_FIELD,
      fieldName: "gender",
      fieldValue: selectedGender,
    });

    if (!selectedGender) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "genderError",
        errorValue: "Please select a gender*",
      });
    } else {
      dispatch({
        type: ActionTypes.SET_ERROR,
        errorName: "genderError",
        errorValue: "",
      });
    }
  };

  const postData = async () => {
    dispatch({ type: ActionTypes.SET_LOADING, value: true });
    setIsLoading(true);
    try {
      setIsLoading(true);
      await createUser({
        firstName,
        email,
        phone,
        password,
        cpassword,
        language,
        gender,
        dob,
      });
      console.log(postData);
      toast.success("User Data created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setIsLoading(false);
      toast.error("Error in the POST API", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, value: false });
      setIsLoading(false);
    }
    navigate("/ReducerApiList");
  };

  const updateUsers = async () => {
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Enter the Required Fields", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    dispatch({ type: ActionTypes.SET_LOADING, value: true });
    try {
      setIsLoading(true);
      await updateuser(id, {
        // Make sure id is correctly set
        firstName,
        email,
        phone,
        password,
        cpassword,
        language,
        gender,
        dob,
      });
      toast.success("User Data Updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("/ReducerApiList");
    } catch (error) {
      setIsLoading(false);
      toast.error("Error in the UPDATE API", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
      dispatch({ type: ActionTypes.SET_LOADING, value: false });
    }
  };

  

  const handleClick = () => {
    const isFormValid = validateForm(); // Validate the form fields

    // Validate all input fields using their respective regex patterns
    const isfirstNameValid = nameRegex.test(firstName);
    const isEmailValid = emailRegex.test(email);
    const isPhoneValid = phoneRegex.test(phone);
    const isPasswordValid = passwordRegex.test(password);
    const isCPasswordValid = cpassword === password;
    const isDobValid = dobRegex.test(dob);

    if (
      isFormValid &&
      isfirstNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid &&
      isCPasswordValid &&
      isDobValid
    ) {
      if (isEditing) {
        updateUsers(); // Submit the form if editing
      } else {
        postData(); // Submit the form if creating a new record
      }
    } else {
      toast.error("Enter the Required Fields or Fix Validation Errors", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  return (
    <>
      <div className="mt-5 p-4 ms-5">
        <NavLink to="/ReducerApiList" className="">
          <Button className="btn btn-dark ms-5 mt-5 p-2 btn-grad1">Back</Button>
        </NavLink>{" "}
      </div>

      <div className="contanier mb-5 mt-5 d-flex justify-content-center">
        <div className="col-md-6 card bg_colour ">
          <h1 className="data text-center w-100 ">User Form</h1>

          <Form className="row p-4">
            <Form.Field className="col-md-6 p-2">
              <label className="fw-bold">
                Name <span className="text-success"></span>
              </label>
              <input
                className={`form-control ${
                  firstNameError ? "is-invalid" : firstName ? "is-valid" : ""
                }`}
                type="name"
                value={firstName}
                onChange={(event) => {
                  dispatch({
                    type: ActionTypes.SET_FIELD,
                    fieldName: "firstName",
                    fieldValue: event.target.value,
                  });
                  handleFieldChange(
                    "Name",
                    event.target.value,
                    nameRegex,
                    "firstNameError"
                  );
                }}
                placeholder="Enter your Name"
              />
              <p className="error-message text-danger mt-2">{firstNameError}</p>
            </Form.Field>

            <br />
            <Form.Field className="col-md-6 p-2">
              <label className="fw-bold">
                Email <span className="text-success"></span>
              </label>
              <input
                type="email"
                className={`form-control ${
                  emailError ? "is-invalid" : email ? "is-valid" : ""
                }`}
                value={email}
                onChange={(event) => {
                  dispatch({
                    type: ActionTypes.SET_FIELD,
                    fieldName: "email",
                    fieldValue: event.target.value,
                                           });
                  handleFieldChange(
                    "Email",
                    event.target.value,
                    emailRegex,
                    "emailError"
                  );
                }}
                placeholder="Enter your Email..."
              />
              <p className="error-message text-danger mt-2">{emailError}</p>
            </Form.Field>
            <Form.Field className="col-md-6 p-2">
              <label className="fw-bold">
                Phone Number <span className="text-success"></span>
              </label>
              <input
                type="number"
                className={`form-control ${
                  phoneError ? "is-invalid" : phone ? "is-valid" : ""
                }`}
                value={phone}
                onChange={(event) => {
                  dispatch({
                    type: ActionTypes.SET_FIELD,
                    fieldName: "phone",
                    fieldValue: event.target.value,
                  });
                  handleFieldChange(
                    "Phone Number",
                    event.target.value,
                    phoneRegex,
                    "phoneError"
                  );
                }}
                placeholder="Enter your Phone..."
                required
              />
              <p className="error-message text-danger mt-2">{phoneError}</p>
            </Form.Field>
            <br />

            <div className="col-md-6 mt-2">
              <label className="fw-bold">
                Password <span className="text-success"></span>
              </label>
              <div className="">
                <div className="input-field-wrapper">
                  <input
                    className={`form-control ${
                      passwordError ? "is-invalid" : password ? "is-valid" : ""
                    }`}
                    name="Password"
                    value={password}
                    onChange={(event) => {
                      dispatch({
                        type: ActionTypes.SET_FIELD,
                        fieldName: "password",
                        fieldValue: event.target.value,
                      });
                      handleFieldChange(
                        "Password",
                        event.target.value,
                        passwordRegex,
                        "passwordError"
                      );
                    }}
                    placeholder="Enter your Password"
                  />
                </div>
              </div>
              <p className="error-message text-danger mt-2">{passwordError}</p>
            </div>

            <div className="col-md-6 mt-3">
              <label className="fw-bold">
                Confirm Password <span className="text-success"></span>
              </label>
              <div className="">
                <div className="input-field-wrapper">
                  <input
                    className={`form-control ${
                      cpasswordError
                        ? "is-invalid"
                        : cpassword
                        ? "is-valid"
                        : ""
                    }`}
                    name="Confirm password"
                    value={cpassword}
                    onChange={(event) => {
                      dispatch({
                        type: ActionTypes.SET_FIELD,
                        fieldName: "cpassword",
                        fieldValue: event.target.value,
                      });
                      handleFieldChange(
                        "Confirm Password",
                        event.target.value,
                        (value) => value === password,
                        "cpasswordError"
                      );
                    }}
                    placeholder="Enter your Confirm password"
                  />
                </div>
              </div>

              <p className="error-message text-danger mt-2">{cpasswordError}</p>
            </div>
            <br />
            {/* <Form.Field className="col-md-6 p-2">
              <label className="fw-bold mb-2">Language </label>
              <select
                value={language}
                onChange={(event) => {
                  dispatch({
                    type: ActionTypes.SET_FIELD,
                    fieldName: "language",
                    fieldValue: event.target.value,
                  });
                }}
                placeholder="Enter Language...."
                className={`form-control ${
                  languageError ? "is-invalid" : language ? "is-valid" : ""
                }`}
              >
                <option value="">Select a language</option>;
                <option value="Tamil">Tamil</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Hindi">Telugu</option>
                <option value="Hindi">kannada</option>
              </select>

              <p className="error-message text-danger mt-2">{languageError}</p>
            </Form.Field> */}
            <Form.Field className="col-md-6 p-2">
              <label className="fw-bold mb-2">Language </label>
              <select
                value={language}
                onChange={handleLanguageChange} // Add the onChange event handler here
                placeholder="Enter Language...."
                className={`form-control ${
                  languageError ? "is-invalid" : language ? "is-valid" : ""
                }`}
              >
                <option value="">Select a language</option>
                <option value="Tamil">Tamil</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
              <p className="error-message text-danger mt-2">{languageError}</p>
            </Form.Field>
            <br />
            {/* <Form.Field className="col-md-6 p-2">
              <label className="fw-bold mb-2"> Gender : </label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Male"
                    className=""
                    checked={gender === "Male"}
                    onChange={(e) => {
                      dispatch({
                        type: ActionTypes.SET_FIELD,
                        fieldName: "gender",
                        fieldValue: e.target.value,
                      });
                    }}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="Female"
                    className="ms-2"
                    checked={gender === "Female"}
                    onChange={(e) => {
                      dispatch({
                        type: ActionTypes.SET_FIELD,
                        fieldName: "gender",
                        fieldValue: e.target.value,
                      });
                    }}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    value="Custom"
                    className="ms-2 "
                    checked={gender === "Custom"}
                    onChange={(e) => {
                      dispatch({
                        type: ActionTypes.SET_FIELD,
                        fieldName: "gender",
                        fieldValue: e.target.value,
                      });
                    }}
                  />
                  Custom
                </label>
              </div>
              <p className="error-message text-danger mt-2">{genderError}</p> */}
              <Form.Field className="col-md-6 p-2">
              <label className="fw-bold mb-2">Gender: </label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Male"
                    className=""
                    checked={gender === "Male"}
                    onChange={handleGenderChange} // Add the onChange event handler here
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="Female"
                    className="ms-2"
                    checked={gender === "Female"}
                    onChange={handleGenderChange} // Add the onChange event handler here
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    value="Custom"
                    className="ms-2"
                    checked={gender === "Custom"}
                    onChange={handleGenderChange} // Add the onChange event handler here
                  />
                  Custom
                </label>
              </div>
              <p className="error-message text-danger mt-2">{genderError}</p>
            </Form.Field>
            <br />
            <Form.Field className="col-md-6 p-2">
              <label className="fw-bold">
                Date of Birth <span className="text-success"></span>
              </label>
              <input
                className={`form-control ${
                  dobError ? "is-invalid" : dob ? "is-valid" : ""
                }`}
                type="date"
                dobno="dob"
                value={dob}
                onChange={(event) => {
                  dispatch({
                    type: ActionTypes.SET_FIELD,
                    fieldName: "dob",
                    fieldValue: event.target.value,
                  });
                  handleFieldChange(
                    "Date of Birth",
                    event.target.value,
                    dobRegex,
                    "dobError"
                  );
                }}
                placeholder="Enter your dob..."
                required
              />
              <p className="error-message text-danger mt-2">{dobError}</p>
            </Form.Field>

            {/* <Button
                className="btn btn-primary mt-3  custom-submit-button"
                onClick={handleClick}
              >
                {isEditing ? "Update" : "Submit"}
              </Button> */}
            <div className="text-center">
              <Button
                className="btn btn-primary mt-3 custom-submit-button"
                onClick={handleClick}
              >
                {isEditing ? "Update" : "Submit"}
              </Button>
            </div>
          </Form>
        </div>
        {isLoading && (
          <div className="loading-spinner-container">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Workform;
