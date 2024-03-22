import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  height: 100%;
  padding: 20px 20px 20px 20px;
  width: 100%;
  max-width: 720px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const NoDecoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const HomeMenu = styled.span`
  color: white;
  font-size: 25px;
  font-weight: 600;
  width: 100%;
  height: 44px;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
`;

const SmallText = styled.span`
  font-size: 10px;
  white-space: nowrap;
  margin: 3px 0px 0px 15px;
`;

const MyMenu = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid white;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.03);
    cursor: pointer;
  }
`;

const MyMenuBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 18px;
  margin: 5px 0px 20px 0px;
  font-weight: 600;
  font-size: 15px;
`;

const MenuItem = styled.span`
  &:hover {
    cursor: pointer;
  }
`;

const AvatarImg = styled.img`
  width: 140%;
`;

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const user = auth.currentUser;
  const avatar = user?.photoURL;
  const navigate = useNavigate();
  const onLogOut = async () => {
    const ok = confirm("정말로 로그아웃 하실 거예요?");
    if (ok) {
      await auth.signOut();
      navigate("/");
    }
  };
  return (
    <Wrapper>
      <Menu>
        <NoDecoLink to="/">
          <HomeMenu>YHJ 𝕏</HomeMenu>
          <SmallText>Developed by yeohj0710</SmallText>
        </NoDecoLink>
        <MyMenu onClick={toggleMenu}>
          {avatar ? (
            <AvatarImg src={avatar} />
          ) : (
            <svg
              data-slot="icon"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"></path>
            </svg>
          )}
        </MyMenu>
      </Menu>
      {isMenuOpen && (
        <MyMenuBox>
          {user !== null ? (
            <>
              <NoDecoLink to="/profile">
                <MenuItem>내 프로필</MenuItem>
              </NoDecoLink>
              <MenuItem onClick={onLogOut} className="log-out">
                로그아웃
              </MenuItem>
            </>
          ) : (
            <>
              <NoDecoLink to="login">
                <MenuItem>로그인</MenuItem>
              </NoDecoLink>
              <NoDecoLink to="create-account">
                <MenuItem>회원가입</MenuItem>
              </NoDecoLink>
            </>
          )}
        </MyMenuBox>
      )}
      <Outlet />
    </Wrapper>
  );
}
