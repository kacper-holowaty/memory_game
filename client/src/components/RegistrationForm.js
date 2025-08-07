import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useMemory } from "../context/MemoryContext";

function RegistrationForm({ showLoginForm }) {
  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useMemory();

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      login: Yup.string()
        .required("Login jest wymagany")
        .min(3, "Login musi mieć co najmniej 3 znaki")
        .max(20, "Login może mieć maksymalnie 20 znaków")
        .matches(
          /^[a-zA-Z0-9ąęółśżźćńĄĘÓŁŚŻŹĆŃ_.-]*$/,
          "Login może zawierać tylko litery, cyfry i znaki: _ - ."
        ),
      password: Yup.string()
        .required("Hasło jest wymagane")
        .min(6, "Hasło musi mieć co najmniej 6 znaków")
        .max(30, "Hasło może mieć maksymalnie 30 znaków"),
      confirmPassword: Yup.string()
        .required("Potwierdzenie hasła jest wymagane")
        .oneOf([Yup.ref("password"), null], "Hasła muszą być takie same"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post("/register", {
          login: values.login,
          password: values.password,
        });

        if (response.data.success) {
          dispatch({
            type: "SET_CURRENT_USER",
            payload: { user: response.data.user, token: response.data.token },
          });
          setTimeout(() => {
            navigate("/game");
          }, 500);
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          setRegistrationError(error.response.data.message);
        } else {
          setRegistrationError("Wystąpił błąd. Spróbuj ponownie później.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });
  
  return (
    <div className="registration-form">
      <h2>Zarejestruj się</h2>
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Powtórz hasło:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <span className="error">{formik.errors.confirmPassword}</span>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Zarejestruj się
          </button>
          <div className="form-links">
            <div className="menu-link">
              <button type="button" onClick={() => navigate("/")}>
                Ekran startowy
              </button>
            </div>
            <button
              type="button"
              className="back-to-login"
              onClick={() => showLoginForm()}
            >
              Powrót do logowania
            </button>
          </div>
        </div>
        {registrationError && <div className="error">{registrationError}</div>}
      </form>
    </div>
  );
}

export default RegistrationForm;
