// 보관용: 현재 진입점에서 불러오지 않는다. 소셜 로그인을 다시 활성화할 때 사용한다.
import { createClient } from "@supabase/supabase-js";

export async function createSocialAuth(apiBase) {
  const response = await fetch(`${apiBase}/config`, { signal:AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error("로그인 설정을 불러오지 못했습니다.");
  const config = await response.json();
  return createClient(config.supabaseUrl, config.publishableKey, { auth:{ flowType:"pkce" } });
}
