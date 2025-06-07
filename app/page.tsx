"use client";
import { useLogin } from "@/hooks/use-login";
import { Input, Button, Label } from "@/components/ui/";
import Loading from "@/components/loading";

export default function SignIn() {
  const { error, loading, handleSubmit } = useLogin();

  if(loading) return <Loading />

  return (
    <div className="flex flex-col justify-center items-center gap-3 h-[50vh]">
      <h2 className="first-letter:uppercase font-bold text-xl text-center pt-6">iniciar sesión</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full lg:w-1/2 gap-3 px-3"
      >
        <Label>
          user
          <Input name="email" type="email" required/>
        </Label>

        <Label>
          password
          <Input name="password" type="password" required/>
        </Label>
        <Button variant="outline">
          sign in
        </Button>
        {error && <span className="text-red-500">{error}</span>}
      </form>
    </div>
  );
}
