import React, { useState } from "react";
import axios from "axios";
import qs from "qs";
import { API_BASE_URL } from "../../config";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError("");

    try {
      console.log("Отправляем запрос:", { email });

      const response = await axios.post(
        `${API_BASE_URL}/password-forgot`,
        qs.stringify({ email }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setMessage("Лист для скидання пароля надіслано");
      } else {
        setError("Помилка відправки листа");
      }
    } catch (error) {
      console.error("Помилка відправки:", error.response || error.message);
      setError("Помилка підключення до сервера");
    }
  };

  return (
    <div className="auth-container">
      <form className="form-fogot" onSubmit={handleSubmit}>
        <h2>Відновлення пароля</h2>
        <input
          className="input-defolt input-emeil"
          type="email"
          placeholder="Введіть ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="submit-button2" type="submit">
          Відправити
        </button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <p className="highlight ">
          <a href="/login">Повернутися до входу</a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
