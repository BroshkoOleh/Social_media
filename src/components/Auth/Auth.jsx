import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Preloader from "../common/Preloader";
import {
  setEmail,
  setPassword,
  fetchRegistration,
  fetchAuthorization,
} from "../../redux/slices/authSlice";
import { fetchProfileByUserId } from "../../redux/slices/profileSlice";
import { API_BASE_URL } from "../../config"; // Імпортуємо базову URL адресу з конфігу
import "./Auth.css";
import google_img from "./images-login/G+.svg";
import {
  successNotify,
  errorNotify,
  warningNotify,
  infoNotify,
} from "../../utils/modalNotification";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, password, error, isAuthenticated } = useSelector((state) => state.auth);
  const isAuthLoading = useSelector((state) => state.auth.loading);
  const isProfileLoading = useSelector((state) => state.profile.loading);

  const [isRegistering, setIsRegistering] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { profileData } = useSelector((state) => state.profile);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (storedEmail && storedPassword) {
      dispatch(setEmail(storedEmail));
      dispatch(setPassword(storedPassword));
      setIsRegistering(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    }
  }, [isAuthenticated, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          warningNotify("Passwords do not match");
          return;
        }

        const { status } = await dispatch(fetchRegistration({ email, password })).unwrap();

        if (status === 201) {
          warningNotify("Check your email to verify your account.");
          navigate("/");
        } else {
          errorNotify("Registration error");
        }
      } else {
        const response = await dispatch(
          fetchAuthorization({ email, password, rememberMe })
        ).unwrap();
        const profileResponse = await dispatch(fetchProfileByUserId(response.id));

        if (profileResponse.error?.message === "Rejected") {
          navigate("/registration");
          infoNotify("Please complete your registration");
        } else if (profileResponse.payload) {
          successNotify("Authorization was successful");
          navigate("/home");
        } else {
          errorNotify("Error getting profile");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      errorNotify("Something went wrong. Try again.");
      warningNotify("Make sure you have verified your email");
    }
  };

  return (
    <>
      {isAuthLoading || isProfileLoading ? (
        <Preloader />
      ) : (
        <div className="auth-container">
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>{isRegistering ? "Реєстрація" : "Авторизація"}</h2>
            <input
              className="input-defolt input-emeil"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => dispatch(setEmail(e.target.value))}
              required
            />

            <div className="container-pasword">
              <input
                className="input-reset__pasword"
                type={showPassword ? "text" : "password"}
                placeholder="Новый пароль"
                value={password}
                onChange={(e) => dispatch(setPassword(e.target.value))}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {isRegistering && (
              <div className="container-pasword">
                <input
                  className="input-reset__pasword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle-btn"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            )}

            {!isRegistering && (
              <label className="remember-label">
                Remember me
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </label>
            )}

            {error && <p className="error">{error}</p>}

            <button className="submit-button" type="submit">
              {isRegistering ? "Зарегистрироваться" : "Войти"}
            </button>

            {!isRegistering && (
              <button
                className="gogle-button"
                type="button"
                onClick={() =>
                  (window.location.href = `${API_BASE_URL}/oauth2/authorization/google`)
                }
              >
                Вход через Google <img src={google_img} alt="Google Login" />
              </button>
            )}
            <hr className="auth-line"></hr>
            <p onClick={() => setIsRegistering(!isRegistering)} className="toggle">
              {isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
            </p>
            {!isRegistering && (
              <p className="highlight ">
                <a href="/forgot-password">Забыли пароль?</a>
              </p>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default Auth;
