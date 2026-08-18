import { SignUp } from "@clerk/clerk-react";

export default function RegisterPage() {
  return (
    <div className="flex justify-center pt-8">
      <SignUp routing="hash" signInUrl="/login" fallbackRedirectUrl="/" />
    </div>
  );
}
