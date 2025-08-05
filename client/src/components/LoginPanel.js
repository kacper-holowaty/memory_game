import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RegistrationForm from "./RegistrationForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMemory } from "../context/MemoryContext";

function LoginPanel() {
  const [loginForm, setLoginForm] = useState(true);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useMemory();

  const showLoginForm = () => {
    setLoginForm(true);
  };
  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: Yup.object({
      login: Yup.string().required("Login jest wymagany"),
      password: Yup.string().required("Hasło jest wymagane"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/login",
          values,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setLoginError("");
          dispatch({ type: "SET_CURRENT_USER", payload: response.data.user });
          setTimeout(() => {
            navigate("/game");
          }, 500);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setLoginError("Nieprawidłowy login lub hasło. Spróbuj ponownie.");
        } else {
          console.error("Nie udało się zalogować", error);
          setLoginError(
            "Wystąpił błąd podczas logowania. Spróbuj ponownie później."
          );
        }
      }
    },
  });

  return (
    <div className="login-panel">
      {loginForm ? (
        <div className="login-form">
          <h2>Zaloguj się</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="login">Login:</label>
              <input
                type="text"
                id="login"
                name="login"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.login}
              />
              {formik.touched.login && formik.errors.login && (
                <span className="error">{formik.errors.login}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Hasło:</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="error">{formik.errors.password}</span>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Zaloguj się
              </button>
              <div className="register-link">
                Nie masz konta?{" "}
                <button type="button" onClick={() => setLoginForm(false)}>
                  Zarejestruj się
                </button>
              </div>
            </div>
            {loginError && <div className="error">{loginError}</div>}
          </form>
        </div>
      ) : (
        <div>
          <RegistrationForm showLoginForm={showLoginForm} />
        </div>
      )}
    </div>
  );
}

export default LoginPanel;
