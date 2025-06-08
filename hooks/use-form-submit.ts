import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { SubmitHandlerProps } from "@/types/handle-submit";

export function useFormSubmit<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const { push } = useRouter();

  const handleSubmit = useCallback(
    ({
      data,
      url,
      method = "post",
      useFormData = false,
      transformToFormData,
      onSuccess,
      redirectTo,
    }: SubmitHandlerProps<T>) => {
      return async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!data) return;
        try {
          setLoading(true);
          const body =
            useFormData && transformToFormData
              ? transformToFormData(data)
              : JSON.stringify(data);

          const res = await fetch(url, {
            method,
            body,
            credentials: "include",
          });

          const responseData = await res.json();

          if (!res.ok) {
            throw new Error(responseData.error);
          }

          onSuccess(responseData);
          push(redirectTo);
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
    },
    [push]
  );

  return useMemo(
    () => ({ loading, error, handleSubmit, setLoading }),
    [loading, error, handleSubmit, setLoading]
  );
}
