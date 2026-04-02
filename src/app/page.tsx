import Link from "next/link";

/**
 * Landing pública — apresenta o produto e leva a login/cadastro.
 */
export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Breshopping</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        Gestão de brechó, pensada para peças únicas.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Cadastre seu brechó, organize seu estoque e acompanhe o desempenho com um fluxo rápido, quase como
        postar uma foto.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/register"
          className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          Criar conta
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
