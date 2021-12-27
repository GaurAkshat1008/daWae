import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
      <Head>
      </Head>
      
    </ChakraProvider>
  );
}

export default MyApp;
