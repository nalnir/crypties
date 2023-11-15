
import "../styles/globals.css";
import type { AppType } from 'next/app';
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalModal from "@/recoil-state/global_modal/global_modal";
import ErrorSuccess from "@/recoil-state/error_success/error_success";
import { ProgressiveLoader } from "@/recoil-state/progressive_loader/progressive_loader";
import { Inter } from "@next/font/google";
import connectDB from "@/backend/connection";
import { api } from "@/utils/api";

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

const MyApp: AppType = ({ Component, pageProps }) => {
  return <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <GlobalModal />
      <ErrorSuccess />
      <ProgressiveLoader />
    </QueryClientProvider>
  </RecoilRoot>
};

MyApp.getInitialProps = async (appContext) => {
  console.log('getInitialProps: -> ()')
  // const db = await connectDB();

  // Call the page's getInitialProps if it exists
  const pageProps = appContext.Component.getInitialProps
    ? await appContext.Component.getInitialProps(appContext.ctx)
    : {};

  // return { pageProps, db };
  return { pageProps };
};

export default api.withTRPC(MyApp);
