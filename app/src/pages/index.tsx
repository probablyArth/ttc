import { signIn, signOut, useSession } from "next-auth/react";
import { H1 } from "~/components/typography/h1";
import { Button } from "~/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/router";

export default function Home() {
  const { status } = useSession();

  const router = useRouter();

  return (
    <>
      <H1>Talk to Channels</H1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Ask any question and get it answered with the channel as context.
      </p>
      <div className="[&:not(:first-child)]:mt-6">
        {status === "authenticated" ? (
          <div className="flex gap-4">
            <Button
              onClick={() => {
                void router.push("/dashboard");
              }}
            >
              Go to dashboard
            </Button>
            <Button
              onClick={() => {
                void signOut();
              }}
              variant={"outline"}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              void signIn();
            }}
          >
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        )}
      </div>
    </>
  );
}
