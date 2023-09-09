import "../styles/globals.css";
import StoreProvider from "../store/store-context";

function MyApp({ Component, pageProps }:{
  Component: any,
  pageProps: any
}) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;