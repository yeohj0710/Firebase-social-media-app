import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const GoToHomeLink = styled(Link)`
  width: 100%;
  text-decoration: none;
  color: inherit;
  margin-top: 50px;
`;

const GoToHomeButton = styled.span`
  background-color: #1d9bf0;
  color: white;
  font-weight: 500;
  width: 100%;
  height: 44px;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
`;

const GitHubButton = styled.span`
  margin-top: 10px;
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function LoginOptionButtons() {
  const navigate = useNavigate();
  const onClick = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <>
      <GoToHomeLink to="/">
        <GoToHomeButton>홈페이지로 이동하기</GoToHomeButton>
      </GoToHomeLink>
      <GitHubButton onClick={onClick}>
        <Logo src="/github-logo.svg" />
        Github 계정으로 로그인하기
      </GitHubButton>
    </>
  );
}
