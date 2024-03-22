import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 55px 1fr;
  grid-gap: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Column = styled.div``;

const AvatarWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const NameDateBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const DateSpan = styled.span`
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
  color: gray;
`;

const Payload = styled.p`
  margin: 10px 0px 0px 0px;
  font-size: 15px;
  line-height: 24px;
`;

const Photo = styled.img`
  width: 100%;
  margin-top: 13px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 15px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.02);
    cursor: pointer;
  }
`;

const DeleteButton = styled.button`
  background-color: transparent;
  color: #999999;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin: -10px -5px 0px 0px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.img`
  max-width: 80%;
  max-height: 80%;
`;

export default function Tweet({
  username,
  photo,
  tweet,
  userId,
  id,
  createdAt,
}: ITweet) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  async function fetchAvatarUrl() {
    try {
      setLoading(true);
      const listRef = ref(storage, `avatars`);
      const res = await listAll(listRef);
      const avatarExists = res.items.some((itemRef) => itemRef.name === userId);
      if (!avatarExists) {
        setLoading(false);
        return;
      }
      const locationRef = ref(storage, `avatars/${userId}`);
      const url = await getDownloadURL(locationRef);
      setAvatarUrl(url);
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching avatar URL:", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchAvatarUrl();
  }, []);
  const calculateTimeSinceCreation = () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const secondsAgo = currentTimestamp - createdAt / 1000 + 1;
    if (secondsAgo < 60) {
      const flooredSecondsAgo = Math.floor(secondsAgo);
      return `${flooredSecondsAgo}초 전`;
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return `${minutesAgo}분 전`;
    } else if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      return `${hoursAgo}시간 전`;
    } else if (secondsAgo < 2592000) {
      const daysAgo = Math.floor(secondsAgo / 86400);
      return `${daysAgo}일 전`;
    } else if (secondsAgo < 31536000) {
      const monthsAgo = Math.floor(secondsAgo / 2592000);
      return `${monthsAgo}달 전`;
    } else {
      const yearsAgo = Math.floor(secondsAgo / 31536000);
      return `${yearsAgo}년 전`;
    }
  };
  const date = calculateTimeSinceCreation();
  const [showModal, setShowModal] = useState(false);
  const [modalPhoto, setModalPhoto] = useState("");
  const handlePhotoClick = () => {
    setModalPhoto(photo ?? "");
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("정말로 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <Wrapper>
      <AvatarWrapper>
        {!loading && avatarUrl !== "" ? (
          <AvatarImg src={avatarUrl} />
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
      </AvatarWrapper>
      <Column>
        <Row>
          <NameDateBox>
            <Username>
              {username.length <= 10
                ? username
                : `${username.substring(0, 10)}...`}
            </Username>
            <DateSpan>{date}</DateSpan>
          </NameDateBox>
          {user?.uid === userId ? (
            <DeleteButton onClick={onDelete}>삭제</DeleteButton>
          ) : null}
        </Row>
        <Payload>{tweet}</Payload>
        {photo ? <Photo src={photo} onClick={handlePhotoClick} /> : null}
      </Column>
      {showModal && (
        <ModalWrapper onClick={handleCloseModal}>
          <ModalContent src={modalPhoto} onClick={(e) => e.stopPropagation()} />
        </ModalWrapper>
      )}
    </Wrapper>
  );
}
