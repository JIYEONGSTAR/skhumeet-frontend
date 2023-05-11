import { Category } from "@/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";
import styled from "styled-components";
import Seo from "@/components/utils/Seo";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getPostById } from "@/hooks/main";
import PostDetail from "@/components/PostDetail";
import { queryKeys } from "@/react-query/constants";

//todo: 한솥밥, 어울림일 경우 기한 표시
const Detail = ({ id }: { id: number }) => {
  const { data, isError, isLoading, error } = useQuery(
    [queryKeys.detail, +id],
    () => getPostById(id)
  );

  if (isLoading) return <>로딩 중</>;
  if (isError) return <>{error}</>;
  return (
    <>
      <Seo />
      <PostDetail data={data} />
    </>
  );
};

export default Detail;

export const getServerSideProps: GetServerSideProps<{ id: number }> = async (
  context: GetServerSidePropsContext
) => {
  const { query } = context;
  const queryClient = new QueryClient();

  // const category = query.category as Category;
  const id = query.id as unknown as number;
  await queryClient.prefetchQuery([queryKeys.detail, +id], () =>
    getPostById(id)
  );
  return {
    props: {
      id,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Container = styled.div`
  margin-top: 1rem;
`;
