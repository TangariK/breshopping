import { RegisterWizard } from "@/features/auth/ui/RegisterWizard";

/**
 * Cadastro em duas etapas (usuário + negócio).
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <RegisterWizard />
    </div>
  );
}
