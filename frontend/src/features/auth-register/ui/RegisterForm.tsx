import { Input } from '@/src/shared/ui/input';

const RegisterForm = () => {
  return (
    <form>
      <div>
        <label htmlFor="email" className="uppercase text-[12px]">
          Email
        </label>
        <Input placeholder="you@example.com" className="py-3 pr-10.5 pl-10" />
      </div>
      <div>
        <label htmlFor="password" className="uppercase text-[12px]">
          Password
        </label>
        <Input
          placeholder="минимум 8 символов"
          className="py-3 pr-10.5 pl-10"
        />
      </div>
    </form>
  );
};

export default RegisterForm;
