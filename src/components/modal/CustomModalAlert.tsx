import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { createRoot } from "react-dom/client";
interface CustomAlertProps {
  message: string;
  onConfirm: () => void;
}

const CustomAlert = ({ message, onConfirm }: CustomAlertProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    setShowModal(false);
    setTimeout(() => onConfirm(), 1);
  };

  useEffect(() => {
    setTimeout(() => setShowModal(true), 1);
  }, []);
  return (
    <>
      {/* 아무곳이나 눌러도 알림 창 사라지게 */}
      <AlertModal.Container showModal={showModal} onClick={handleConfirm}>
        <AlertModal.Content>
          <LogoImg src="/Logo.svg" alt="logo" height="50%" />
          <AlertModal.Message>{message}</AlertModal.Message>
        </AlertModal.Content>
      </AlertModal.Container>
    </>
  );
};

const customAlert = (message: string) => {
  const handleConfirm = () => {
    const modalRoot = document.getElementById("modal-alert-portal-wrapper");
    if (modalRoot) modalRoot.remove();
  };
  if (typeof window !== "undefined") {
    const subDiv = document.createElement("div");
    subDiv.id = "modal-alert-portal-wrapper";
    document.body.appendChild(subDiv);

    const root = createRoot(subDiv);
    root.render(<CustomAlert message={message} onConfirm={handleConfirm} />);
    // https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
  }
};

export default customAlert;

const AlertModal = {
  Container: styled.div<{ showModal: boolean }>`
    position: fixed;
    top: -100px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: all 0.1s ease-in-out;
    cursor: default;

    ${({ showModal }) =>
      showModal &&
      css`
        top: 0;
        opacity: 1;
        pointer-events: auto;
      `}
  `,

  Content: styled.div`
    margin-top: 20px;
    background-color: white;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    max-width: 400px;
    width: 100%;
    height: 7rem;
    position: relative;
  `,

  Message: styled.div`
    font-size: 1.2rem;
  `,
};

const LogoImg = styled.img`
  width: 15vw;
  object-fit: contain;
`;
