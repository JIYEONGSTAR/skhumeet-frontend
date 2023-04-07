import HomeList from "@/components/List/HomeList";
import Pagination from "@/components/Pagination";
import Seo from "@/components/utils/Seo";
import { useState } from "react";
import styled from "styled-components";

const mock_data = [
  {
    category: "한솥밥",
    items: [
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: false },
      { title: "[모집]000모집" },
      { title: "[모집]000모집", isRecruiting: true },
    ],
  },
  {
    category: "한솥밥",
    items: [
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: false },
      { title: "[모집]000모집" },
      { title: "[모집]000모집", isRecruiting: true },
    ],
  },
  {
    category: "한솥밥",
    items: [
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: false },
      { title: "[모집]000모집" },
      { title: "[모집]000모집", isRecruiting: true },
    ],
  },
  {
    category: "한솥밥",
    items: [
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: false },
      { title: "[모집]000모집" },
      { title: "[모집]000모집", isRecruiting: true },
    ],
  },
  {
    category: "한솥밥",
    items: [
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: false },
      { title: "[모집]000모집" },
      { title: "[모집]000모집", isRecruiting: true },
    ],
  },
  {
    category: "한솥밥",
    items: [
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: true },
      { title: "[모집]000모집", isRecruiting: false },
      { title: "[모집]000모집" },
      { title: "[모집]000모집", isRecruiting: true },
    ],
  },
];

export default function Home() {
  const [page, setPage] = useState<number>(1);

  const [totalPage, setTotalPage] = useState<number>(0);

  return (
    <HomeContainer>
      <Seo />
      <Banner />
      <ListGridWrapper>
        {mock_data.map((el) => (
          <HomeList category={el.category} items={el.items} key={el.category} />
        ))}
      </ListGridWrapper>
      <Pagination
        totalPages={totalPage}
        currentPage={page}
        onPageChange={setPage}
      ></Pagination>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Banner = styled.div`
  width: 100%;
  height: 30vh;
  background-color: ${({ theme }) => theme.color.main};
`;

const ListGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  @media screen and (max-width: ${(props) => props.theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`;
