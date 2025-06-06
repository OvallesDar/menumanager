export interface SubmitHandlerProps<T> {
  data: T;
  url: string;
  useFormData?: boolean;
  transformToFormData?: (data: T) => FormData;
  onSuccess: (responseData: T) => void;
  redirectTo: string;
}
