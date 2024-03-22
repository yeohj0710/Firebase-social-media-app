import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Unsubscribe, updateProfile } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { Navigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  overflow-y: scroll;
`;

const AvatarBox = styled.div``;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const NameBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditNameDiv = styled.div`
  flex-direction: column;
`;

const EditNameFormDiv = styled.div`
  margin: 0px 0px 7px 40px;
`;

const EditNameInput = styled.input`
  padding: 5px 8px;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 15px;
`;

const EditNameMessage = styled.span`
  font-size: 10px;
  line-height: 1.5;
  margin-left: 35px;
`;

const EditNameButton = styled.button`
  margin-left: 5px;
  padding: 5px 10px;
  background-color: #1d9bf0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0c688e;
  }
`;

const Name = styled.span`
  font-size: 22px;
`;

const NameEditButton = styled.button`
  width: 20px;
  height: 20px;
  padding: 0px;
  margin-left: 7px;
  font-size: 10px;
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
`;

const ProfileMessage = styled.span`
  font-size: 12px;
`;

const MyTitle = styled.span`
  font-size: 20px;
  margin: 30px auto 5px 0px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const EmptyDiv = styled.div`
  min-height: 10vh;
`;

const NoTweetMessage = styled.span``;

const SmallText = styled.span`
  font-size: 10px;
  line-height: 1.5;
  margin: 0px 0px 20px 0px;
`;

export default function Profile() {
  const user = auth.currentUser;
  if (!user) {
    return <Navigate to="/" />;
  }
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const handleNameEditClick = () => {
    setEditingName(true);
  };
  const handleConfirmName = async () => {
    await updateProfile(user, {
      displayName: newName,
    });
    setEditingName(false);
  };
  const handleCancelName = () => {
    setEditingName(false);
  };
  const onAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      <AvatarBox>
        <AvatarUpload htmlFor="avatar">
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
        </AvatarUpload>
        <AvatarInput
          onChange={onAvatarChange}
          id="avatar"
          type="file"
          accept="image/*"
        />
      </AvatarBox>
      <NameBox>
        {editingName ? (
          <EditNameDiv>
            <EditNameFormDiv>
              <EditNameInput
                type="text"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
              />
              <EditNameButton onClick={handleConfirmName}>확인</EditNameButton>
              <EditNameButton onClick={handleCancelName}>취소</EditNameButton>
            </EditNameFormDiv>
            <EditNameMessage>
              닉네임을 수정해도 이전 트윗의 닉네임은 변경되지 않아요.
            </EditNameMessage>
          </EditNameDiv>
        ) : (
          <>
            <Name>{user?.displayName ?? "익명"}</Name>
            <NameEditButton onClick={handleNameEditClick}>
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                ></path>
              </svg>
            </NameEditButton>
          </>
        )}
      </NameBox>
      <ProfileMessage>
        프로필 사진을 눌러 이미지를 설정할 수 있어요.
      </ProfileMessage>
      <MyTitle>내 트윗 목록</MyTitle>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
      {tweets.length === 0 ? (
        <>
          <NoTweetMessage>아직 작성한 트윗이 없어요.</NoTweetMessage>
        </>
      ) : null}
      {tweets.length >= 1 ? (
        <SmallText>
          트윗은 가장 최근 25개까지만 나타나지만 YHJ 𝕏의 데이터베이스에 모두
          보관됩니다. 업데이트를 기다려주세요!
        </SmallText>
      ) : null}
      {tweets.length <= 0 ? <EmptyDiv /> : null}
      {tweets.length <= 1 ? <EmptyDiv /> : null}
      {tweets.length <= 2 ? <EmptyDiv /> : null}
      {tweets.length <= 3 ? <EmptyDiv /> : null}
    </Wrapper>
  );
}
