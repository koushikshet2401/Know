const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ApiResponse<T = undefined> = {
  success: boolean;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
  data?: T;
};

async function fetchApi<T = undefined>(
  path: string,
  body: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message ?? "An error occurred. Please try again.",
        errors: data.errors,
      };
    }

    return data as ApiResponse<T>;
  } catch {
    return {
      success: false,
      message:
        "Could not reach the server. Please check your connection and try again.",
    };
  }
}

export async function submitDemoRequest(
  data: Record<string, unknown>
): Promise<ApiResponse> {
  return fetchApi("/api/leads/demo", data);
}

export async function submitContactForm(
  data: Record<string, unknown>
): Promise<ApiResponse> {
  return fetchApi("/api/leads/contact", data);
}
