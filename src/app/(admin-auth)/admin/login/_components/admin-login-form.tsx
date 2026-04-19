"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { authService } from "@/services/auth/auth-service";
import { useAuthStore } from "@/stores/auth/use-auth-store";

const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type AdminLoginForm = z.infer<typeof adminLoginSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const inputCls = "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";

export function AdminLoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { mutate: login, isPending, error } = useMutation({
    mutationFn: async (data: AdminLoginForm) => {
      const tokenRes = await authService.login({ ...data, role: "ADMIN" as any });
      const user = await authService.getMe(tokenRes.accessToken);
      return { tokenRes, user };
    },
    onSuccess: ({ tokenRes, user }) => {
      setAuth(user, tokenRes.accessToken, tokenRes.role);
      router.push("/admin/dashboard");
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-[400px] max-w-full">
      <motion.h1 variants={itemVariants} className="font-rozha text-5xl text-[#181D27] mb-8 text-center">
        Admin Panel
      </motion.h1>

      <form onSubmit={handleSubmit((data) => login(data))} className="flex flex-col gap-5">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="font-work-sans text-sm text-red-600">{(error as Error).message}</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-bold text-[#181D27]">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input {...register("email")} type="email" placeholder="Email Address" className={inputCls} />
          {errors.email && <p className="font-work-sans text-xs text-red-500">● {errors.email.message}</p>}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-bold text-[#181D27]">
            Password <span className="text-red-500">*</span>
          </label>
          <PasswordInput {...register("password")} placeholder="Enter your password" className={inputCls} />
          {errors.password && <p className="font-work-sans text-xs text-red-500">● {errors.password.message}</p>}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-14 rounded-full bg-[#181D27] text-white font-work-sans font-semibold text-base hover:bg-[#181D27]/90 transition-colors disabled:opacity-60"
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
