import type { APIRoute } from "astro";
import { lucia } from "../../../lib/auth";

export const POST: APIRoute = async ({ cookies }) => {
    const sessionId = cookies.get(lucia.sessionCookieName)?.value;

    if (sessionId) {
        await lucia.invalidateSession(sessionId);
    }

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/"
        }
    });
};
