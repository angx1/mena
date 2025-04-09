import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full flex flex-col gap-20 items-center pt-20">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
