import "../styles/globals.css";
import "../src/config/firebase.config";
import { AuthProvider } from "../src/hook/auth";
import AuthStateChanged from "../src/layout/AuthStateChanged";
import AppLayout from "../src/layout/AppLayout";
import { MylegosProvider } from "../src/hook/mylegos";
import { ExchangeProvider } from "../src/hook/exchange";
import { SettingsProvider } from "../src/hook/settings";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.title = "Mylegos";
  }, []);

  return (
    <AuthProvider>
      <SettingsProvider>
        <AuthStateChanged>
          <ExchangeProvider>
            <MylegosProvider>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </MylegosProvider>
          </ExchangeProvider>
        </AuthStateChanged>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default MyApp;
