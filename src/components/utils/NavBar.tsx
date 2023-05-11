import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";
import SidebarModal from "./SideModal";
import { ConvertKorean, Category } from "@/types";
import ToggleUser from "@/components/utils/ToggleUser";

const NavBar = () => {
  const category: Category[] = [
    "hansotbab",
    "eoullim",
    "study",
    "club",
    "contest",
    "department_event",
    "etc",
  ];

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  //todo:검색기능
  return (
    <Nav>
      <NavWrapper>
        <TopWrapper>
          <LogoWrapper onClick={() => router.push("/")}>
            <Logo>
              <LogoImg src="/Logo.svg" alt="logo" />
            </Logo>
          </LogoWrapper>
          <NavUser>
            <ToggleUser />
          </NavUser>
        </TopWrapper>
        <SidebarModal handleToggle={toggleMenu} isOpen={isOpen}>
          {category.map((el: Category) => (
            <LinkWrapper
              active={router.asPath.startsWith(`/${el}`).toString()}
              href={`/${el}`}
              key={el}
            >
              {ConvertKorean[el]}
            </LinkWrapper>
          ))}
        </SidebarModal>
      </NavWrapper>
    </Nav>
  );
};

export default NavBar;

const Nav = styled.nav`
  top: 0;
  left: 0;
  right: 0;
  align-items: center;

  position: fixed;
  width: 100%;
  height: 8vh;

  background: ${({ theme }) => theme.color.background};
  box-shadow: 0px 7px 2px -7px ${({ theme }) => theme.color.hover};
  /* box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px; */
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`;

const TopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  top: 0;
  background-color: ${({ theme }) => theme.color.background};
  width: 100%;
  height: 100%;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.large}) {
    width: 80vw;
    padding-right: 40px;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    width: 100vw;
    padding: 5px;
    padding-right: 40px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.large}) {
    width: 60vw;
    padding-right: 0;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.color.background};
  cursor: pointer;
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  :hover {
    transform: scale(1.1);
  }
`;

const LogoImg = styled.img`
  width: 80px;
`;

const NavUser = styled.div`
  display: flex;

  position: relative;
  width: 15%;
  height: 100%;

  text-align: end;
`;

const LinkWrapper = styled(Link)<{ active: string }>`
  display: flex;

  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;

  color: ${(props) => props.theme.color.text};

  ${(props) =>
    props.active === "true" &&
    css`
      text-decoration: underline;
      /* color: ${props.theme.color.hover}; */
      text-underline-offset: 8px;
    `};

  :hover {
    color: ${(props) => props.theme.color.hover};
  }
`;
