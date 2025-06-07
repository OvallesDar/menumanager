import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandlerProps } from "@/types/handle-submit"

export function useFormSubmit<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  const handleSubmit = ({
    data,
    url,
    useFormData = false,
    transformToFormData,
    onSuccess,
    redirectTo,
  }: SubmitHandlerProps<T>) => {
    return async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        setLoading(true);
        const body =
          useFormData && transformToFormData
            ? transformToFormData(data)
            : JSON.stringify(data);

        const res = await fetch(url, {
          method: "post",
          body,
          credentials: "include",
        });

        const responseData = await res.json();

        if (!res.ok) {
          throw new Error(responseData.error);
        }

        onSuccess(responseData);
        router.push(redirectTo);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown Error");
        }
      } finally {
        setLoading(false);
      }
    };
  };

  return { loading, error, handleSubmit };
}
