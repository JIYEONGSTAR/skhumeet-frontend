import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { del, get, instance, post } from "@/libs/api";
import { Category, MAINREQUEST } from "@/types";
import { queryKeys } from "@/react-query/constants";
import { useEffect, useState } from "react";
import customAlert from "@/components/modal/CustomModalAlert";

export const getMainCategory = async (category: Category, page: number) => {
  const res = await get(`/api/post/category/${category}?page=${page}`).then(
    (r: any) => {
      return r.data;
    }
  );

  return res;
};

export const useMainCategory = (category: Category) => {
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();
  useEffect(() => {
    // assume increment of one month
    queryClient.prefetchQuery([queryKeys[category], page + 1], () =>
      getMainCategory(category, page + 1)
    );
  }, [page]);

  const fallback = {};
  const { data = fallback } = useQuery(
    [queryKeys[category], page],
    () => getMainCategory(category, page),
    {
      refetchInterval: 60000, //1분마다 리페치
    }
  );
  return { data, page, setPage };
};

// export const usePrefetchMainCategory = (category: Category, page: number) => {
//   const queryClient = useQueryClient();
//   queryClient.prefetchQuery([queryKeys[category], page + 1], () =>
//     getMainCategory(category, page + 1)
//   );
// };

const postMain = async ({
  title,
  category,
  contact = "email",
  status,
  endDate,
  view,
  context,
  images,
}: MAINREQUEST) => {
  const res = await post("/api/post/new", {
    title,
    category,
    contact,
    status,
    endDate: new Date(endDate),
    view,
    context,
    images,
  }).then((res: any) => {
    return res.data;
  });
  return res;
};

const patchMain = async ({
  title,
  category,
  status,
  contact,
  endDate,
  context,
  images,
  id,
  view,
}: MAINREQUEST & { id: number }) => {
  const res = await instance
    .patch(`/api/post?id=${id}`, {
      title,
      category,
      status,
      contact,
      endDate: new Date(endDate),
      context,
      images,
      view,
    })
    .then((res: any) => {
      return res.data;
    })
    .catch((err: any) => {
      return err;
    });
  return res;
};
export const usePostMainCategory = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (mainRequest: MAINREQUEST) => postMain(mainRequest),
    {
      onSuccess: (data) => {
        const category = data?.category.toLowerCase() as Category;

        // queryClient.invalidateQueries();
        queryClient.invalidateQueries([queryKeys[category]]);
        // queryClient.removeQueries([queryKeys.detail]);
        // queryClient.removeQueries([queryKeys.member]);
        queryClient.setQueryData([queryKeys[category]], () => {
          return getMainCategory(category, 1);
        });
        customAlert("글이 작성되었습니다.");
      },
      onError: () => {
        customAlert("오류발생");
      },
    }
  );
  return mutate;
};

export const usePatchMainCategory = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (mainRequest: MAINREQUEST & { id: number }) => patchMain(mainRequest),
    {
      onSuccess: (data) => {
        const category = data?.category.toLowerCase() as Category;

        // queryClient.invalidateQueries();
        queryClient.invalidateQueries([queryKeys[category]]);
        queryClient.invalidateQueries([queryKeys.member]);
        queryClient.removeQueries([queryKeys.detail]);
        // queryClient.removeQueries([queryKeys.member]);
        queryClient.setQueryData([queryKeys[category]], () => {
          return getMainCategory(category, 1);
        });
        customAlert("글이 수정되었습니다.");
      },
      onError: () => {
        customAlert("오류발생");
      },
    }
  );
  return mutate;
};

export const getPostById = async (id: number) => {
  const res = await get(`/api/post?id=${id}`).then((r: any) => r.data);

  return res;
};

export const deletePostById = async (id: number) => {
  await del(`/api/post?id=${id}`).then((res) => res);
};

export const useDeleteMainCategory = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation((id: number) => deletePostById(id), {
    onSuccess: () => {
      queryClient.invalidateQueries();
      customAlert("글이 삭제되었습니다.");
    },
    onError: () => {
      customAlert("오류발생");
    },
  });
  return mutate;
};
