import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/30">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src="https://i.ibb.co/Ngr4FSQD/Chat-GPT-Image-Jan-16-2026-02-10-48-PM.png" 
            alt="rats logo" 
            className="h-14 w-14 rounded-xl object-cover"
          />
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-foreground">rats</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
