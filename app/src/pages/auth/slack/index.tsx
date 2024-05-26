import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loader from "~/components/loader";
import { H1 } from "~/components/typography/h1";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function Slack() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const router = useRouter();
  const { data, isError, isPending, mutateAsync } =
    api.slack.post.useMutation();

  useEffect(() => {
    void (async () => {
      if (!!code && !!state) {
        await mutateAsync({ code, state }).catch((e) => {
          console.log(e);
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isError)
    return (
      <div className="flex flex-col items-center gap-8">
        <H1>OOPS!</H1>
        An error occured
        <Button
          onClick={() => {
            void router.push("/dashboard");
          }}
        >
          Go back to dashboard
        </Button>
      </div>
    );

  if (isPending) return <Loader />;

  if (!code || !state) {
    return (
      <div className="flex flex-col items-center gap-8">
        <H1>Missing code or state</H1>
        <Button
          onClick={() => {
            void router.push("/dashboard");
          }}
        >
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <H1>
        Talk To Channel joined{" "}
        <span className="text-red-400 underline">{data?.team.name}</span>!
      </H1>
      <Button
        onClick={() => {
          void router.push("/dashboard");
        }}
      >
        Go to dashboard
      </Button>
    </div>
  );
}
