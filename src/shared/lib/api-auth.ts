import { getServerSession } from "@/shared/lib/get-session";
import type { SessionPayload } from "@/shared/lib/session";

/**
 * Garante que a requisição API pertence ao tenant da URL.
 */
export async function requireTenantSession(
  tenantSlug: string,
): Promise<{ session: SessionPayload } | { response: Response }> {
  const session = await getServerSession();
  if (!session || session.tenantSlug !== tenantSlug) {
    return {
      response: new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }
  return { session };
}
