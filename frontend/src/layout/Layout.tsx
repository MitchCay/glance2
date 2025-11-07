import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, Navigate, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-10 py-2 bg-neutral-900">
        <h1>Header</h1>
        <SignedIn>
          <nav className="space-x-5 flex">
            <Link to="/">Dashboard</Link>
            <Link to="/history">Transaction History</Link>
            <UserButton />
          </nav>
        </SignedIn>
      </header>

      <main className="flex flex-1 justify-center items-center">
        <SignedOut>
          <Navigate to="/sign-in" replace />
        </SignedOut>
        <SignedIn>
          <Outlet />
        </SignedIn>
      </main>
    </div>
  );
}
