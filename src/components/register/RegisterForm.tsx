import {
  ConvertKorean,
  Situation,
  categoryList,
  messageList,
  situationList as originSituationList,
} from "@/types";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DropDown from "../utils/DropDown";
import Link from "next/link";
import Btn from "../Btn";
import { Category } from "@/types";
import TextEditor from "../TextEditor";
import imageUpload from "@/hooks/firebase/imageUpload";
import { postMain } from "@/hooks/main";
interface RegisterFormProps {
  category: Category;
  kind: "register" | "edit";
  type?: "list" | "grid";
}

const RegisterForm = ({
  category: defaultCategory,
  kind,
  type = "list",
}: RegisterFormProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [registerType, setRegisterType] = useState(type);

  const initForm = {
    title: "",
    category: defaultCategory,
    contact: "email",
    endDate: new Date().toISOString(),
    view: 1,
    context: "",
    images: [],
  };
  const [form, setForm] = useState(initForm);

  const { title, category, contact, endDate, view, context, images } = form;

  const editSituationList: Partial<Situation>[] = [
    "recruiting",
    "recruitmentCompleted",
  ];
  const [situation, setSituation] = useState<Situation>("recruiting");

  const handleChangeDropDown = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await imageUpload(e.target.files).then((res) => {
        setForm({ ...form, images: { ...images, ...res } });
        console.log(res);
        if (res) {
          console.log("완료후", res);
          const imgElement = document.createElement("img");
          imgElement.setAttribute("src", res);
          imgElement.setAttribute("width", "200");
          imgElement.setAttribute("height", "200");
          contentRef.current?.appendChild(imgElement);
        }
      });
    }
  };

  const handleSubmit = async () => {
    setForm({ ...form, context: contentRef.current?.innerHTML ?? "" });
    console.log(form);
    postMain({
      title,
      category,
      contact,
      endDate,
      view,
      context,
      images,
    }).then((res) => console.log(res));
  };

  useEffect(() => {
    const registerStyle =
      category === "departmentEvent" || category === "club" ? "grid" : "list";
    setRegisterType(registerStyle);
  }, [category]);

  return (
    <RegisterFormContainer>
      <RegisterHeader>
        <DropDown
          name="category"
          list={categoryList}
          onChange={handleChangeDropDown}
          defaultItem={defaultCategory}
        />
        {kind === "register" && registerType === "list" && (
          <span>{ConvertKorean[situation]}</span>
        )}
        {kind === "edit" && registerType === "list" && (
          <DropDown
            name="situation"
            list={editSituationList}
            onChange={handleChangeDropDown}
          />
        )}
        {kind === "register" && registerType === "grid" && (
          <DropDown
            name="situation"
            list={["recruiting", "promotion", "activity"]}
            onChange={handleChangeDropDown}
          />
        )}
        {kind === "edit" && registerType === "grid" && (
          <DropDown
            name="situation"
            list={originSituationList}
            onChange={handleChangeDropDown}
          />
        )}
        <br />
        마감일
        <DateInput
          name="endDate"
          value={endDate}
          type="date"
          onChange={handleChange}
        />
        <br />
        <TitleInput
          name="contact"
          value={contact}
          onChange={handleChange}
          placeholder="오픈채팅 링크 or 전화번호"
        ></TitleInput>
      </RegisterHeader>
      <RegisterBody>
        <FormContainer>
          <TitleInput
            name="title"
            value={title}
            type="text"
            placeholder="제목을 입력해 주세요"
            onChange={handleChange}
          />

          {registerType === "list" ? (
            <ContentInput ref={contentRef} contentEditable={true} />
          ) : (
            <>
              <TextEditor
                editorRef={contentRef}
                handleFileUpload={handleFileUpload}
              />
            </>
          )}
        </FormContainer>
      </RegisterBody>
      <BtnContainer>
        <Link href="/">
          <CancelBtn>취소</CancelBtn>
        </Link>
        <Btn onClick={handleSubmit}>작성하기</Btn>
      </BtnContainer>
    </RegisterFormContainer>
  );
};

export default RegisterForm;

const RegisterFormContainer = styled.div``;

const RegisterHeader = styled.div`
  margin: 1rem 0;
`;

const RegisterBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* width: 40vw; */

  padding: 5px;
  border-top: 2px solid ${({ theme }) => theme.color.main};
  border-bottom: 2px solid ${({ theme }) => theme.color.main};

  > input,
  textarea {
    width: 100%;
    margin: 5px 0;
  }
`;

const DateInput = styled.input`
  margin-left: 10px;

  outline: none;
`;

const TitleInput = styled.input`
  height: 2rem;
  padding-bottom: 5px;

  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.color.main};

  font-size: 1rem;
  outline: none;

  :focus {
    border-bottom: 2px solid ${({ theme }) => theme.color.main};
  }
`;

const ContentInput = styled.div`
  width: 100%;
  height: 50vh;

  overflow: auto;
  border: none;
  text-align: left;

  outline: none;
`;

const BtnContainer = styled.div`
  width: 34.6%;
  float: right;
  padding: 0 5px;
`;

const CancelBtn = styled.button`
  width: 3rem;
  margin-top: 1rem;
  margin-right: 5px;
  padding: 2px 3px;

  background-color: #999999;

  color: white;
  border: 1px solid #999999;
  border-radius: 3px;

  text-align: center;

  :hover {
    background-color: white;
    color: #999999;
  }
`;
