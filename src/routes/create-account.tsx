import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name == "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password == "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.message === "Firebase: Error (auth/invalid-email).") {
          setError(
            "유효하지 않은 이메일 주소입니다. (혹시 .com이 빠져있나요?)"
          );
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
          placeholder="이메일 (로그인 시 아이디로 사용)"
          type="email"
          onChange={onChange}
          required
        />
        <Input
          name="password"
          value={password}
          placeholder="비밀번호 (6글자 이상)"
          type="password"
          onChange={onChange}
          required
        />
        <Input
          name="name"
          value={name}
          placeholder="닉네임"
          type="text"
          onChange={onChange}
          required
        />
        <Input
          type="submit"
          value={isLoading ? "계정 생성 중..." : "계정 만들기"}
        />
      </Form>
      {error !== "" ? (
        <Error
          style={{ fontSize: "13px", lineHeight: "1.7", textAlign: "center" }}
        >
          {error}
        </Error>
      ) : null}
      <Switcher>
        이미 계정이 있나요? <Link to="/login">로그인 &rarr;</Link>
      </Switcher>
      <LoginOptionButtons />
    </Wrapper>
  );
}
