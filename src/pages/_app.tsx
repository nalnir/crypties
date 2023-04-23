import "../styles/globals.css";
import type { AppProps } from "next/app"
import connectDB from "@/backend/connection";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

App.getInitialProps = async () => {
  await connectDB();

  return {};
};
