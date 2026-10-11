import { authContent } from '../model/content';
import type { AuthMode } from '../model/types';

interface AuthFormTitleProps {
  mode: AuthMode;
}

export function AuthFormTitle({ mode }: AuthFormTitleProps) {
  return (
    <>
      <h1 className="font-display font-medium text-[28px] tracking-[-.6px] leading-[1.15]">
        {authContent[mode].formTitle}
      </h1>
      <p className='text-muted text-[15px] mt-2'>{authContent[mode].formDescription}</p>
    </>
  );
}
