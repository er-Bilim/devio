import { AuthPanel } from '@/src/widgets/auth-panel';
import { BrandAside } from '@/src/widgets/auth-panel/ui/BrandAside';

const Auth = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] min-h-screen">
      <BrandAside variant="register" />
      <div className="flex items-center justify-center py-10 px-6 ">
        <div className="max-w-100 w-full">
          <AuthPanel />
        </div>
      </div>
    </div>
  );
};

export default Auth;
