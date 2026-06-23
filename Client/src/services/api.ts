const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${baseURL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${res.status}: ${errorText}`);
  }

  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  del: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};
