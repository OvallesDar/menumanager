import { useCallback, useMemo, useState } from "react";
import { Title } from "@/types/title"

export function useFormInput<T extends {title: Title}>(INITIAL_STATE: T | null) {
  const [data, setData] = useState(INITIAL_STATE);

  const handleChange = useCallback((
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | string
      | boolean,
    name: string
  ) => {
    const value =
      typeof event === "string" || typeof event === "boolean"
        ? event
        : event.target instanceof HTMLInputElement &&
          event.target.type === "file"
        ? event.target.files?.[0]
        : event.target.value;

    setData((prevData) => {
      if (!prevData) return prevData;
      if (name === "es" || name === "en" || name === "fr") {
        return {
          ...prevData,
          title: {
            ...prevData.title,
            [name]: value,
          },
        };
      }

      return {
        ...prevData,
        [name]: value,
      };
    });
  }, []);

  return useMemo(() => ({ data, handleChange, setData }), [data, handleChange, setData]);
}
