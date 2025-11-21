import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";

export function AuthenticationPage() {
  return (
    <div>
      <SignedOut>
        <SignIn routing="path" path="/sign-in" />
        <SignUp routing="path" path="/sign-up" />
      </SignedOut>
      <SignedIn>
        <div>
          <p>You are already signed in.</p>
        </div>
      </SignedIn>
    </div>
  );
}
