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
<form className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-3xl mx-auto">
  <h1 className="col-span-2 text-2xl font-medium">Sign up</h1>
  <p className="col-span-2 text-sm text-foreground">
    Already have an account?{" "}
    <Link className="text-primary font-medium underline" href="/sign-in">
      Sign in
    </Link>
  </p>

  {/* Email */}
  <div>
    <Label htmlFor="email">Email</Label>
    <Input name="email" placeholder="you@example.com" required />
  </div>

  {/* Password */}
  <div>
    <Label htmlFor="password">Password</Label>
    <Input
      type="password"
      name="password"
      placeholder="Your password"
      minLength={6}
      required
    />
  </div>

  {/* Sector */}
  <div>
    <Label htmlFor="sector">Sector</Label>
    <Input name="sector" placeholder="Enter your sector" required />
  </div>

  {/* Street */}
  <div>
    <Label htmlFor="street">Street</Label>
    <Input name="street" placeholder="Enter your street" required />
  </div>

  {/* Building */}
  <div>
    <Label htmlFor="building">Building</Label>
    <Input name="building" placeholder="Enter your building" required />
  </div>

  {/* Apartment */}
  <div>
    <Label htmlFor="apartment">Apartment</Label>
    <Input name="apartment" placeholder="Enter your apartment (optional)" />
  </div>

  {/* City */}
  <div>
    <Label htmlFor="city">City</Label>
    <Input name="city" placeholder="Enter your city" required />
  </div>

  {/* Country */}
  <div>
    <Label htmlFor="country">Country</Label>
    <Input name="country" placeholder="Enter your country" required />
  </div>

  {/* Administrator Checkbox */}
  <div className="col-span-2 flex items-center gap-2 mt-4">
    <input type="checkbox" id="isAdmin" name="isAdmin" />
    <Label htmlFor="isAdmin">Administrator?</Label>
  </div>

  {/* Submit Button */}
  <div className="col-span-2">
    <SubmitButton formAction={signUpAction} pendingText="Signing up...">
      Sign up
    </SubmitButton>
  </div>
</form>
{/* <SmtpMessage /> */}
    </>
  );
}
