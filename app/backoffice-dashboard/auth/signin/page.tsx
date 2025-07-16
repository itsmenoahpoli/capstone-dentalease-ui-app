import { Flex, Card } from "@radix-ui/themes";
import SignInForm from "@/components/modules/auth/SignInForm";

export const metadata = {
  title: "DentalEase - Sign In",
  description: "Sign in to your DentalEase backoffice account",
};

export default function Page() {
  return (
    <Flex className="h-full w-full" direction="column" gap="4">
      <Flex direction="column" gap="1">
        <h1 className="text-xl text-white text-center font-medium">Sign In</h1>
        <p className="text-sm text-gray-300 text-center">
          Please enter your details to access your account.
        </p>
      </Flex>
      <SignInForm />
    </Flex>
  );
}
