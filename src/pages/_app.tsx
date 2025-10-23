import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { AppProps } from "next/app";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
