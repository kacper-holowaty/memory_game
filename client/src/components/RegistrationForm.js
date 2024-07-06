import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function RegistrationForm({ showLoginForm }) {
  const [registrationError, setRegistrationError] = useState("");
  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      login: Yup.string().required("Login jest wymagany"),
      password: Yup.string()
        .required("Hasło jest wymagane")
        .min(6, "Hasło musi mieć co najmniej 6 znaków"),
      confirmPassword: Yup.string()
        .required("Potwierdzenie hasła jest wymagane")
        .oneOf([Yup.ref("password"), null], "Hasła muszą być takie same"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/register",
          values
        );
        if (response.data.success) {
          alert("Rejestracja udana!");
          showLoginForm();
        } else {
          setRegistrationError(
            "Nie udało się zarejestrować. Użytkownik o takiej nazwie już istnieje."
          );
        }
      } catch (error) {
        console.error("Błąd rejestracji:", error);
        setRegistrationError("Wystąpił błąd. Spróbuj ponownie później.");
      }
    },
  });

  // return (
  //   <div>
  //     <h2>Zarejestruj się</h2>
  //     <form onSubmit={formik.handleSubmit}>
  //       <div className="form-group">
  //         <label htmlFor="login">Login:</label>
  //         <input
  //           type="text"
  //           id="login"
  //           name="login"
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //           value={formik.values.login}
  //         />
  //         {formik.touched.login && formik.errors.login && (
  //           <span className="error">{formik.errors.login}</span>
  //         )}
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="password">Hasło:</label>
  //         <input
  //           type="password"
  //           id="password"
  //           name="password"
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //           value={formik.values.password}
  //         />
  //         {formik.touched.password && formik.errors.password && (
  //           <span className="error">{formik.errors.password}</span>
  //         )}
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="confirmPassword">Powtórz hasło:</label>
  //         <input
  //           type="password"
  //           id="confirmPassword"
  //           name="confirmPassword"
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //           value={formik.values.confirmPassword}
  //         />
  //         {formik.touched.confirmPassword && formik.errors.confirmPassword && (
  //           <span className="error">{formik.errors.confirmPassword}</span>
  //         )}
  //       </div>
  //       <div className="form-actions">
  //         <button type="submit">Zarejestruj się</button>
  //         <button
  //           type="button"
  //           className="back-to-login"
  //           onClick={() => showLoginForm()}
  //         >
  //           Powrót do logowania
  //         </button>
  //       </div>
  //       {registrationError && <div className="error">{registrationError}</div>}
  //     </form>
  //   </div>
  // );

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
          <button type="submit">Zarejestruj się</button>
          <button
            type="button"
            className="back-to-login"
            onClick={() => showLoginForm()}
          >
            Powrót do logowania
          </button>
        </div>
        {registrationError && <div className="error">{registrationError}</div>}
      </form>
    </div>
  );
}

export default RegistrationForm;
