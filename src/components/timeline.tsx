import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const SmallText = styled.span`
  font-size: 10px;
  line-height: 1.5;
  margin: 20px 0px 10px 0px;
`;

const EmptyDiv = styled.div`
  min-height: 15vh;
`;

const NoTweetMessage = styled.span``;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
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
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
      {tweets.length === 0 ? (
        <>
          <NoTweetMessage>아직 작성된 트윗이 없어요.</NoTweetMessage>
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
