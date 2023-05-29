import React from "react";
import Head from "next/head";
const Seo = ({ title }: { title?: string }) => {
  return (
    <Head>
      <link rel="shortcut icon" href="/skhumeet.ico" />
      <title>{title && `${title} | `}SKHUMEET</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="성공회대학교 소통의 장 - SKHUMEET" />
      <meta name="keywords" content="SKHU, SKHUMEET, 성공회대학교, 성공회대" />
      <meta name="author" content="SKHUMEET" />
      <meta property="og:title" content="SKHUMEET" key="title" />
      <meta
        property="og:description"
        content="성공회대학교 소통의 장 - SKHUMEET"
      />
      <meta property="og:image" content="/Banner.svg" />
      <meta property="og:url" content="https://skhumeet.vercel.app/" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ko_KR" />
    </Head>
  );
};

export default Seo;
