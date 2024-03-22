import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import LoginOptionButtons from "../components/login-option-btns";

export default function LogIn() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (isLoading || email === "" || password == "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.message === "Firebase: Error (auth/invalid-login-credentials)."
        ) {
          setError("계정이 존재하지 않거나, 비밀번호가 올바르지 않습니다.");
        } else setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title to="/">YHJ 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          value={email}
          placeholder="이메일"
          type="email"
          onChange={onChange}
          required
        />
        <Input
          name="password"
          value={password}
          placeholder="비밀번호"
          type="password"
          onChange={onChange}
          required
        />
        <Input type="submit" value={isLoading ? "로그인 중..." : "로그인"} />
      </Form>
      {error !== "" ? (
        <Error
          style={{ fontSize: "13px", lineHeight: "1.7", textAlign: "center" }}
        >
          {error}
        </Error>
      ) : null}
      <Switcher>
        아직 계정이 없나요? <Link to="/create-account">회원가입 &rarr;</Link>
      </Switcher>
      <LoginOptionButtons />
    </Wrapper>
  );
}
