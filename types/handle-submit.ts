export interface SubmitHandlerProps<T> {
  data: T | null;
  url: string;
  method?: string,
  useFormData?: boolean;
  transformToFormData?: (data: T) => FormData;
  onSuccess: (responseData: T) => void;
  redirectTo: string;
}
