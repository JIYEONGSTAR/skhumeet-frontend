import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { User } from "@/types";
import { get, post } from "@/libs/api";
import customAlert from "./modal/CustomModalAlert";

export interface Comment {
  author: string;
  childComments: string[];
  context: string;
  id: number;
  modifiedDate: string;
  writer: string;
}

const Comment = ({ postId }: { postId: number }) => {
  const [newComment, setNewComment] = useState<string>("");

  const [list, setList] = useState<Comment[]>();

  useEffect(() => {
    const getComment = async () => {
      await get(`/api/comment/${postId}/page/1`).then((res: any) => {
        setList(res.data);
      });
    };
    getComment();
  }, []);

  const handleSubmitComment = () => {
    if (newComment.length === 0) {
      customAlert("댓글을 작성해주세요");
      return;
    }

    post(`/api/comment/new`, {
      postId,
      context: newComment,
    });
  };

  return (
    <>
      {list?.length ? (
        <>
          {list.map((el) => (
            <Container
              style={{ marginBottom: "1rem" }}
              key={(el.id, el.writer, el.context)}
            >
              <CommentItem key={el.id}>
                <Writer>{el.writer}</Writer>
                <span>{el.context} </span>
              </CommentItem>
              {/* <TimeContainer style={{ paddingLeft: "0" }}>
                <DateP style={{ color: "#8e8e8e", marginBottom: "5px" }}>
                  {formatDate(el.modifiedDate)}
                </DateP>
              </TimeContainer>{" "} */}
            </Container>
          ))}
        </>
      ) : (
        <Notion>댓글없음</Notion>
      )}

      {/* <CommentForm onSubmit={handleSubmitComment}> */}
      <CommentInput
        placeholder="Write comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Btn onClick={handleSubmitComment}>저장하기</Btn>
      {/* </CommentForm> */}
    </>
  );
};

export default Comment;

const TimeContainer = styled.div`
  float: left;
  padding-top: 5px;
  padding-left: 10px;
`;

const Container = styled.div`
  border-bottom: 1px solid #d3d3d3;
`;

const CommentItem = styled.div`
  width: 55vw;

  color: black;
`;

const Writer = styled.span`
  margin-right: 1rem;

  font-weight: 600;
`;

const CommentForm = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 55vw;
  margin-bottom: 2rem;
`;

const CommentInput = styled.textarea`
  width: 50vw;
  height: 5vh;

  border: none;
  border-bottom: 1px solid black;

  outline: none;
`;

const Notion = styled.p`
  color: black;
`;

const DateP = styled.p`
  float: left;
  margin-bottom: 2rem;

  color: #f0f0f0;

  font-size: small;
  text-align: left;
`;

const Btn = styled.button`
  display: flex;
  align-items: center;

  width: fit-content;
  margin: 0 5px;
  padding: 2px 3px;

  background-color: white;
  border: black;
  border-radius: 10px;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;
