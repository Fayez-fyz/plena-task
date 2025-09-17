import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home/page";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./lib/rainbow";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Provider store={store}>
              <PersistGate
                loading={<div>Loading...</div>}
                persistor={persistor}
              >
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                  </Routes>
                </BrowserRouter>
              </PersistGate>
            </Provider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
