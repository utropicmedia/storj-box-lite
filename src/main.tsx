import { Buffer } from "buffer";
import process from "process";
import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { UseWalletProvider } from "use-wallet";
import App from "./App";
import "./index.css";
import { store } from "./store/store";
window.process = process;
window.Buffer = Buffer || require("buffer").Buffer;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <UseWalletProvider connectors={{}}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    </UseWalletProvider>
  </React.StrictMode>,
  document.querySelector("#root")
);
