import { useState, useRef, FormEvent } from "react";
import { useSelector } from "react-redux";
import store, { RootState } from "../../state";
import styles from "./index.module.css";
import { login, register } from "./state";

const Auth = () => {
  const state = useSelector((state: RootState) => state.auth);

  const [mode, setMode] = useState<"login" | "register">("login");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    store.dispatch(
      (mode === "login" ? login : register)({
        email: emailRef.current!.value!,
        password: passwordRef.current!.value!,
      })
    );
  };

  const toggleMode = (m: "login" | "register") =>
    setMode(m === "login" ? "register" : "login");

  return (
    <main>
      <section>
        <h2>{mode === "register" ? "Create your account" : "Welcome back"}</h2>

        {state.error && <div className={styles.form}>An error occured</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>email</label>
          <input data-testid="email" required ref={emailRef} />
          <label>password</label>
          <input data-testid="password"
            required
            type="password"
            ref={passwordRef}
          />
          <button type="submit" disabled={state.loading}>
            SUBMIT
          </button>
          <span onClick={() => toggleMode(mode)}>
            {mode === "login"
              ? "switch to register mode"
              : "switch to login mode"}
          </span>
        </form>
      </section>
    </main>
  );
};

export default Auth;
