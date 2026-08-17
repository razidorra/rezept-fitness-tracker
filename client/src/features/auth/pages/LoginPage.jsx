import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="flex justify-center pt-8">
      <SignIn />
    </div>
  );
}
