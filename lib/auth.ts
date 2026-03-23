import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/** 서버 컴포넌트 / Route Handler에서 세션 가져오기 */
export function getSession() {
  return getServerSession(authOptions);
}

/** 사용자가 최소 requiredRole 이상인지 확인 */
export function hasRole(role: number | undefined, required: number): boolean {
  return (role ?? 0) >= required;
}
