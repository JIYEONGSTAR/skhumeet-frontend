import {
  ConvertKorean,
  MAIN,
  MAINREQUEST,
  Status,
  categoryList,
  formDate,
  statusList as originStatusList,
} from "@/types";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DropDown from "../utils/DropDown";
import Link from "next/link";
import Btn from "../utils/Btn";
import { Category } from "@/types";
import TextEditor from "../TextEditor";
import imageUpload from "@/hooks/firebase/imageUpload";
import { usePatchMainCategory, usePostMainCategory } from "@/hooks/main";
import customAlert from "../modal/CustomModalAlert";
import { useRouter } from "next/router";

interface RegisterFormProps {
  category: Category;
  kind: "register" | "edit";
  type?: "list" | "grid";
  data?: MAIN;
}

const RegisterForm = ({
  category: defaultCategory = "hansotbab",
  kind,
  type = "list",
  data,
}: RegisterFormProps) => {
  const postMain = usePostMainCategory();
  const patchMain = usePatchMainCategory();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [registerType, setRegisterType] = useState(type);

  const initForm = {
    title: data?.title ?? "",
    category: data?.category ?? defaultCategory ?? "hansotbab",
    contact: data?.contact ?? "",
    status: (data?.status.toLowerCase() as Status) ?? originStatusList[0],
    endDate:
      (formDate(data?.endDate) as string) ??
      (formDate(new Date().toISOString()) as string),
    view: data?.view ?? 0,
    context: data?.context ?? "",
    images: data?.images ?? [],
  };

  const [form, setForm] = useState<MAINREQUEST>(initForm);

  const { title, category, contact, status, endDate, view, context, images } =
    form;

  const editStatusList: Partial<Status>[] = originStatusList.filter((el) =>
    el.startsWith("recruit")
  );

  const handleChangeDropDown = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await imageUpload(e.target.files).then((res) => {
        setForm({ ...form, images: [...images, ...res] });

        if (res) {
          customAlert("이미지 업로드 완료");
          const imgElement = document.createElement("img");
          imgElement.setAttribute("src", res);
          imgElement.setAttribute("width", "200");
          imgElement.setAttribute("height", "200");
          contentRef.current?.appendChild(imgElement);
        }
      });
    }
    return "";
  };

  const handleSubmit = () => {
    //todo 입력 실패 시 입력이 아예 안될지...?
    if (title.length === 0) {
      customAlert("제목을 입력해 주세요");
    }
    if (context.length === 0) {
      customAlert("내용을 입력해 주세요");
    }
    if (contact.length === 0) {
      customAlert("연락 방법을 입력해 주세요");
    }
    if (kind === "register") {
      postMain({
        title,
        category,
        contact,
        status,
        endDate,
        view,
        context,
        images,
      });
    } else {
      patchMain({
        title,
        category,
        status,
        contact,
        endDate,
        context,
        images,
        view,
        id: data?.id!,
      });
    }

    router.back(); //바로 전 화면
    // router.push(`/${category?.toLowerCase()}`);
  };

  const handleContextChange = (content: string) => {
    setForm({ ...form, context: content });
  };

  useEffect(() => {
    const registerStyle =
      category?.toLowerCase() === "department_event" ||
      category?.toLowerCase() === "club"
        ? "grid"
        : "list";
    setRegisterType(registerStyle);
  }, [category]);

  return (
    <RegisterFormContainer>
      <RegisterHeader>
        {/* <h3 style={{ marginBottom: "1rem" }}>
          {kind === "edit" && <div>수정하기</div>}
        </h3> */}
        {kind === "edit" ? (
          <span
            style={{
              fontWeight: "bold",
              marginRight: "5px",
            }}
          >
            {ConvertKorean[category?.toLowerCase() as Category]}
          </span>
        ) : (
          <DropDown
            name="category"
            list={categoryList}
            onChange={handleChangeDropDown}
            defaultItem={category?.toLowerCase()}
          />
        )}

        {kind === "register" && registerType === "list" && (
          <span style={{ fontSize: "small", fontWeight: "bold" }}>
            상태: {ConvertKorean[status]}
          </span>
        )}
        {kind === "edit" && registerType === "list" && (
          <DropDown
            defaultItem={status}
            name="status"
            list={editStatusList}
            onChange={handleChangeDropDown}
          />
        )}
        {kind === "register" && registerType === "grid" && (
          <DropDown
            name="status"
            list={originStatusList.filter(
              (el) => el !== "recruitment_deadline"
            )}
            onChange={handleChangeDropDown}
          />
        )}
        {kind === "edit" && registerType === "grid" && (
          <DropDown
            defaultItem={status}
            name="status"
            list={originStatusList}
            onChange={handleChangeDropDown}
          />
        )}
        <br />
        <DateContainer>
          마감일
          <ContactInput
            style={{ margin: "0", marginLeft: "5px" }}
            name="endDate"
            value={endDate}
            type="date"
            onChange={handleChange}
          />
        </DateContainer>
        <DateContainer>
          연락 방법
          <ContactInput
            name="contact"
            value={contact}
            onChange={handleChange}
            placeholder="오픈채팅 링크 or 전화번호"
          />
        </DateContainer>
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
            <ContentInput
              name="context"
              value={context}
              onChange={handleChange}
            />
          ) : (
            <>
              <TextEditor
                editorRef={contentRef}
                handleFileUpload={handleFileUpload}
                handleContextChange={handleContextChange}
                context={context}
              />
            </>
          )}
        </FormContainer>
      </RegisterBody>
      <BtnContainer>
        <Link href="/">
          <Btn onClick={() => {}} color="#999999">
            취소
          </Btn>
        </Link>
        <Btn onClick={handleSubmit}>
          {kind === "register" ? "작성하기" : "수정하기"}
        </Btn>
      </BtnContainer>
    </RegisterFormContainer>
  );
};

export default RegisterForm;

const RegisterFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  padding: 1rem 20px;

  background-color: ${({ theme }) => theme.color.background};
`;

const RegisterHeader = styled.div`
  margin: 5px 0;
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

  width: 100%;

  border-top: 2px solid ${({ theme }) => theme.color.light};
  border-bottom: 2px solid ${({ theme }) => theme.color.light};

  > input,
  textarea {
    width: 100%;
    resize: none;
  }
`;

const DateContainer = styled.div`
  font-size: small;
`;

const ContactInput = styled.input`
  margin: 10px;
  padding: 5px;

  outline: none;

  border: none;
  box-shadow: 0px 0px 5px -1.5px inset #69b030;
`;

const TitleInput = styled.input`
  padding: 1rem 0;

  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.color.light};

  font-size: 1rem;
  font-weight: 600;
  outline: none;
`;

const ContentInput = styled.textarea`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 45vh;
  margin: 1rem 0;
  /* padding-top: 1rem; */

  overflow: auto;
  border: none;
  text-align: left;

  line-height: 180%;
  outline: none;
  word-break: break-all;

  :focus-visible {
    border: 1px dashed ${({ theme }) => theme.color.main};
    border-radius: 3px;
    outline: none;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 1rem;
`;
