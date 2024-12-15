import { r as redirect } from "../../../../../chunks/index2.js";
const GET = async (event) => {
  const { url, locals } = event;
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";
  if (!code) {
    console.error("OAuth code is missing.");
    throw redirect(303, "/auth/auth-code-error?message=missing-code");
  }
  try {
    const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Error exchanging code for session:", error.message);
      throw redirect(303, "/auth/auth-code-error");
    }
    if (!data.session) {
      console.error("No session returned during exchange.");
      throw redirect(303, "/auth/auth-code-error?message=missing-session");
    }
    throw redirect(303, next);
  } catch (err) {
    console.error("Unexpected error during OAuth callback:", err);
    throw redirect(303, "/auth/auth-code-error");
  }
};
export {
  GET
};
