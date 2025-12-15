import "@/App.css";
import ClerkProviderWithRoutes from "@/auth/ClerkProviderWithRoutes";
import { Route, Routes } from "react-router-dom";
import { AuthenticationPage } from "@/auth/AuthenticationPage";
import { Layout } from "@/layout/Layout";
import { Dashboard } from "@/dashboard/Dashboard";
import { TransactionHistory } from "@/history/TransactionHistory";
import { ThemeProvider } from "@/components/theme-provider";
import AddTransaction from "./add-transaction/AddTransaction";
import { Toaster } from "@/components/ui/sonner";

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
            <Route path="/add-transaction" element={<AddTransaction />} />
          </Route>
        </Routes>
        <Toaster />
      </ClerkProviderWithRoutes>
    </ThemeProvider>
  );
}

export default App;
