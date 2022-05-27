interface IAuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: IAuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-card text-center">{children}</div>
    </div>
  );
}

export default AuthLayout;
