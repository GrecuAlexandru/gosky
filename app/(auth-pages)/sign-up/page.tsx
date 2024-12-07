import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
<form className="flex flex-col min-w-64 max-w-64 mx-auto">
  <h1 className="text-2xl font-medium">Sign up</h1>
  <p className="text-sm text-foreground">
    Already have an account?{" "}
    <Link className="text-primary font-medium underline" href="/sign-in">
      Sign in
    </Link>
  </p>
  <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
    {/* Email */}
    <Label htmlFor="email">Email</Label>
    <Input name="email" placeholder="you@example.com" required />

    {/* Password */}
    <Label htmlFor="password">Password</Label>
    <Input
      type="password"
      name="password"
      placeholder="Your password"
      minLength={6}
      required
    />

    {/* Additional fields */}
    <Label htmlFor="sector">Sector</Label>
    <Input name="sector" placeholder="Enter your sector" required />

    <Label htmlFor="street">Street</Label>
    <Input name="street" placeholder="Enter your street" required />

    <Label htmlFor="building">Building</Label>
    <Input name="building" placeholder="Enter your building" required />

    <Label htmlFor="apartment">Apartment</Label>
    <Input name="apartment" placeholder="Enter your apartment (optional)"/>

    <Label htmlFor="city">City</Label>
    <Input name="city" placeholder="Enter your city" required />

    <Label htmlFor="country">Country</Label>
    <Input name="country" placeholder="Enter your country" required />

    <SubmitButton formAction={signUpAction} pendingText="Signing up...">
      Sign up
    </SubmitButton>
  </div>
</form>
<SmtpMessage />
    </>
  );
}
