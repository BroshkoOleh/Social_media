import { NavLink } from "react-router-dom";
import { API_BASE_URL } from "../../config"; // Імпортуємо базову URL адресу з конфігу
import styles from "./FirstPageMain.module.scss";

export default function FirstPageMain() {
  // Обработчик для кнопки "Continue with Google"
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`; // Використовуємо базову URL
  };

  return (
    <>
      <main className={styles.firstPageMain}>
        <section className={styles.firstPageLeftSide}>
          <h1 className={styles.firstPageLeftSideTitle}>
            Welcome to the community of specialists!
          </h1>
          <div className={styles.firstPageLeftSideBtnContainer}>
            <button
              className={styles.firstPageLeftSideBtnGoogle}
              onClick={handleGoogleLogin} // Добавили обработчик на клик
            >
              Continue with Google
            </button>
            <button className={styles.firstPageLeftSideBtnEmail}>Login using email</button>
          </div>
          <p className={styles.firstPageLeftSideConfidenPolice}>
            By clicking «Continue», you agree to the <span>Users Agreement</span>,{" "}
            <span>Privacy Policy</span>, and the use of LinkedIn's cookies.
          </p>
          <h4 className={styles.firstPageLeftSideNotSignIn}>
            Not signed up on LinkedIn?{" "}
            <NavLink to="/login">
              <span>Sign Up</span>
            </NavLink>
          </h4>
        </section>
        <section className={styles.firstPageRightSide}>
          <img src="/image/first-page/firstPageMainImg.svg" alt="First Page Illustration" />
        </section>
      </main>
    </>
  );
}
