import { API_BASE_URL, API_CLIENT_ID, API_CLIENT_SECRET, CACHE_TTL } from "./constants";
import { getCached, setCached } from "./cache";

const TOKEN_CACHE_KEY = "oauth_token";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function getAccessToken(): Promise<string> {
  const cached = getCached<string>(TOKEN_CACHE_KEY);
  if (cached) return cached;

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: API_CLIENT_ID,
    client_secret: API_CLIENT_SECRET,
  });

  const res = await fetch(`${API_BASE_URL}/gateway/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`OAuth token request failed: ${res.status} ${res.statusText}`);
  }

  const data: TokenResponse = await res.json();
  setCached(TOKEN_CACHE_KEY, data.access_token, CACHE_TTL.TOKEN);
  return data.access_token;
}
