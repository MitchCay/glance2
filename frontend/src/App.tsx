import "./App.css";
import ClerkProviderWithRoutes from "./auth/ClerkProviderWithRoutes";
import { Route, Routes } from "react-router-dom";
import { AuthenticationPage } from "./auth/AuthenticationPage";
import { Layout } from "./layout/Layout";
import { Dashboard } from "./dashboard/Dashboard";
import { TransactionHistory } from "./history/TransactionHistory";
import { EditTransactions } from "./edit-transactions/EditTransactions";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ClerkProviderWithRoutes>
        <Routes>
          <Route path="/sign-in/*" element={<AuthenticationPage />} />
          <Route path="/sign-up" element={<AuthenticationPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route
              path="/edit-transactions"
              element={<EditTransactions />}
            ></Route>
          </Route>
        </Routes>
      </ClerkProviderWithRoutes>
    </ThemeProvider>
  );
}

export default App;
