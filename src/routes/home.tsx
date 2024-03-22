import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
`;

const MessageBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1d9bf0;
  font-weight: 500;
  padding: 20px 25px;
  border-radius: 15px;
  gap: 10px;
`;

const Message = styled.span`
  color: white;
  line-height: 1.5;
`;

const LoginButton = styled.button`
  min-width: 70px;
  background-color: white;
  color: #1d9bf0;
  font-size: 14px;
  font-weight: 500;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

export default function Home() {
  const user = auth.currentUser;
  return (
    <Wrapper>
      {user !== null ? (
        <PostTweetForm />
      ) : (
        <MessageBox>
          <Message>트윗을 작성하려면 로그인 해 주세요!</Message>
          <Link to="/login">
            <LoginButton>로그인하기</LoginButton>
          </Link>
        </MessageBox>
      )}
      <Timeline />
    </Wrapper>
  );
}
