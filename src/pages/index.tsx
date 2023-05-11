import HomeList from "@/components/List/HomeList";
import Btn from "@/components/utils/Btn";
import Footer from "@/components/utils/Footer";
import Seo from "@/components/utils/Seo";
import { getMainCategory, useMainCategory } from "@/hooks/main";
import { queryKeys } from "@/react-query/constants";
import { Category } from "@/types";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import router from "next/router";
import styled from "styled-components";

export default function Home() {
  const hansotbab = useMainCategory("hansotbab").data;
  const eoullim = useMainCategory("eoullim").data;
  const study = useMainCategory("study").data;
  const club = useMainCategory("club").data;
  const contest = useMainCategory("contest").data;
  const department_event = useMainCategory("department_event").data;
  const etc = useMainCategory("etc").data;

  return (
    <HomeContainer>
      <Seo />
      {/* <MainBanner /> */}
      <BannerImg src="/Banner.svg" alt="banner" />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
          alignItems: "center",
        }}
      >
        <RegisterButton
          onClick={() => {
            router.push("/register");
          }}
        >
          스쿠밋과 함께하러가기
        </RegisterButton>
      </div>
      <ListGridWrapper>
        {hansotbab && (
          <HomeList
            category={"hansotbab"}
            items={hansotbab.content ?? []}
            key={"hansotbab"}
          />
        )}
        {eoullim && (
          <HomeList
            category={"eoullim"}
            items={eoullim.content ?? []}
            key={"eoullim"}
          />
        )}
        {study && (
          <HomeList
            category={"study"}
            items={study.content ?? []}
            key={"study"}
          />
        )}
        {club && (
          <HomeList category={"club"} items={club.content ?? []} key={"club"} />
        )}
        {contest && (
          <HomeList
            category={"contest"}
            items={contest.content ?? []}
            key={"contest"}
          />
        )}
        {department_event && (
          <HomeList
            category={"department_event"}
            items={department_event.content ?? []}
            key={"department_event"}
          />
        )}
        {etc && (
          <HomeList category={"etc"} items={etc.content ?? []} key={"etc"} />
        )}
      </ListGridWrapper>
      <Footer />
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  cursor: default;
`;

const BannerImg = styled.img`
  -webkit-user-drag: none;
`;

const ListGridWrapper = styled.div`
  margin: 1rem 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media screen and (max-width: ${(props) => props.theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`;

const RegisterButton = styled(Btn)`
  width: 10rem;
  height: 2rem;
`;

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([queryKeys.hansotbab, 1], () =>
    getMainCategory(queryKeys.hansotbab as Category, 1)
  );
  await queryClient.prefetchQuery([queryKeys.eoullim, 1], () =>
    getMainCategory(queryKeys.eoullim as Category, 1)
  );
  await queryClient.prefetchQuery([queryKeys.study, 1], () =>
    getMainCategory(queryKeys.study as Category, 1)
  );
  await queryClient.prefetchQuery([queryKeys.club, 1], () =>
    getMainCategory(queryKeys.club as Category, 1)
  );
  await queryClient.prefetchQuery([queryKeys.contest, 1], () =>
    getMainCategory(queryKeys.contest as Category, 1)
  );
  await queryClient.prefetchQuery([queryKeys.department_event, 1], () =>
    getMainCategory(queryKeys.department_event as Category, 1)
  );
  await queryClient.prefetchQuery([queryKeys.etc, 1], () =>
    getMainCategory(queryKeys.etc as Category, 1)
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
