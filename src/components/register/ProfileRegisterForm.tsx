import React, { ChangeEvent, useState } from "react";
import { LoginUserProfileProps } from "@/pages/auth";
import styled from "styled-components";
import { useAuth } from "@/hooks/user";
import Btn from "@/components/utils/Btn";
import customAlert from "../modal/CustomModalAlert";
import Image from "next/image";

const ProfileRegisterForm = ({
  id,
  name = "",
  nickname,
  profile_image,
}: LoginUserProfileProps) => {
  const { signup } = useAuth();

  const [nameForm, setNameForm] = useState<string>(name);
  const [studentIdForm, setStudentIdForm] = useState<string>("");

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setNameForm(e.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentIdForm(e.target.value);
  };

  const handleSubmit = () => {
    if (
      nameForm.length === 0 ||
      studentIdForm.length === 0
      // !!Number(val)는 문자열이 숫자일 때 true를 리턴
    ) {
      customAlert("이름과 학번을 입력해 주세요");
    } else {
      studentIdForm &&
        signup(studentIdForm, id, nameForm, nickname, profile_image).then(
          (res) => {
            if (res?.status && res.status === 200) {
              setTimeout(() => window.location.replace("/"), 500);
            }
          }
        );
    }

    // axios.post
  };

  return (
    <Container>
      <Wrapper>
        {/* todo: 이미지최적회 */}
        <Image src="/Logo.svg" alt="logo" />
        <div>
          <h3 style={{ marginBottom: "10px" }}>
            SKHUMEET에 오신 것을 환영합니다!
          </h3>
          <h4>
            <H4Wrapper>
              성공회대 학생(교수)임을 <mark>인증</mark>하기 위해&nbsp;
            </H4Wrapper>
            <mark>이름과 학번(사번)</mark> 을 정확히 입력해주세요!
          </h4>
        </div>
        <div style={{ width: "100%" }}>
          <div>
            <InputSpan>이름 </InputSpan>
            <Input
              value={nameForm}
              onChange={handleChangeName}
              // placeholder="학번을 입력해주세요"
            />
          </div>
          <StudentNumContainer>
            <InputSpan>학번 </InputSpan>
            <Input
              value={studentIdForm}
              onChange={handleChange}
              // placeholder="학번을 입력해주세요"
            />
          </StudentNumContainer>
        </div>
        <Btn onClick={handleSubmit}>입력</Btn>
      </Wrapper>
    </Container>
  );
};

export default ProfileRegisterForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: fixed;
  width: 100%;
  max-height: 100%;
  margin: auto;

  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  overflow: auto;
  background-color: ${({ theme }) => theme.color.background};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  width: 30rem;
  height: 40rem;
  padding: 2rem 0;

  background-color: ${({ theme }) => theme.color.background};
  border: 2px solid ${({ theme }) => theme.color.main};
  border-radius: 20px;

  text-align: center;

  cursor: default;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.small}) {
    width: 73%;
    height: 30%;
  }

  > div > h3 {
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.small}) {
      font-size: 80%;
    }

    @media screen and (max-width: ${({ theme }) => theme.breakpoints.medium}) {
      font-size: 120%;
    }
  }

  > div > h4 {
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.small}) {
      font-size: 60%;
    }

    @media screen and (max-width: ${({ theme }) => theme.breakpoints.medium}) {
      margin-bottom: 2rem;
      font-size: 100%;
    }
  }
`;

const H4Wrapper = styled.div`
  display: inline-block;

  font-size: 0.8rem;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.small}) {
    display: block;
  }
`;

const Input = styled.input`
  width: 50%;
  height: 35px;
  margin-left: 10px;
  padding: 0 5px;

  border: 1px solid ${({ theme }) => theme.color.main};
  border-radius: 3px;

  outline: none;

  :focus {
    border: 2px solid ${({ theme }) => theme.color.main};
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.small}) {
    height: 20px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    height: 25px;
  }
`;

const StudentNumContainer = styled.div`
  margin-top: 1rem;
`;

const InputSpan = styled.span`
  font-weight: bold;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: 80%;
  }
`;
