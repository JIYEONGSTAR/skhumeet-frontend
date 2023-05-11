import React, { useEffect, useState } from "react";
import Layout from "@/components/utils/Layout";
import type { AppProps } from "next/app";
import ThemeProvider from "@/context/ThemeProvider";
import { GlobalStyle } from "../styles/GlobalStyle";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Head from "next/head";
import { storageConstants } from "@/types";
import { useRouter } from "next/router";
import { queryClient } from "@/react-query/queryClient";
import { ToTop } from "@/components/utils/ToTop";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem(storageConstants.accessToken)
    ) {
      setIsLoggedIn(false);
    }
    if (!isLoggedIn) {
      if (!router.pathname.startsWith("/auth")) {
        router.push("/auth");
      }
    }
  }, [isLoggedIn]);
  return (
    <>
      <Head>
        <script
          src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2-nopolyfill.js"
          async
        />
        <script src="https://developers.kakao.com/sdk/js/kakao.js" async />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GlobalStyle />
          <Layout>
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
              <ToTop />
            </Hydrate>
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
