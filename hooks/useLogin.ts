import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLogin() {
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError(result.code?.split(".")[0] + ".");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    window.location.reload();
  };

  return { error, loading, handleSubmit };
}
