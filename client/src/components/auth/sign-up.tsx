import { useForm, type SubmitHandler } from "react-hook-form";

interface SignUpProps {
  onSignup: SubmitHandler<Inputs>;
}

interface Inputs {
  email: string;
  name: string;
  password: string;
}

export default function Signup({ onSignup }: SignUpProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  return (
    <form onSubmit={handleSubmit(onSignup)} className="flex flex-col gap-2">
      <input type="email" {...register("email", { required: true })} />
      <input type="text" {...register("name", { required: true })} />
      <input type="password" {...register("password", { required: true })} />
      <button
        className="p-2 border-2 border-black disabled:opacity-50"
        type="submit"
        disabled={isSubmitting}
      >
        Register
      </button>
    </form>
  );
}
