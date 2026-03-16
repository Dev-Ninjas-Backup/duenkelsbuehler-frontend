import { LoginForm } from "./_components/login-form";
import { LoginIllustration } from "./_components/login-illustration";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-5xl mx-auto flex items-center gap-16 lg:gap-24">
        {/* Left - Form */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <LoginForm />
        </div>

        {/* Right - Illustration */}
        <LoginIllustration />
      </div>
    </div>
  );
}
