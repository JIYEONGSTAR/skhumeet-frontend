import { useState, useEffect } from "react";
import styled from "styled-components";
import { AiOutlineArrowUp } from "react-icons/ai";

export const ToTop = () => {
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <Button onClick={scrollToTop}>
          <AiOutlineArrowUp fontSize="large" />
          <ButtonTxt>TOP</ButtonTxt>
        </Button>
      )}
    </>
  );
};

const Button = styled.div`
  position: fixed;
  bottom: 3vw;
  right: 3.5vw;
  opacity: 0.7;
  cursor: pointer;
  /* border: 1px solid  */
  background-color: ${({ theme }) => theme.color.main};
`;

const ButtonTxt = styled.div`
  text-align: center;
  font-size: 11pt;
`;
