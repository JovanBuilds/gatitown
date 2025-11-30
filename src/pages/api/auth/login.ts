import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";
import { lucia } from "../../../lib/auth";
import { Argon2id } from "oslo/password";

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email y contraseña requeridos" }),
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "Credenciales inválidas" }),
                { status: 400 }
            );
        }

        const validPassword = await new Argon2id().verify(user.hashed_password, password);

        if (!validPassword) {
            return new Response(
                JSON.stringify({ error: "Credenciales inválidas" }),
                { status: 400 }
            );
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return new Response(
            JSON.stringify({ message: "Login exitoso" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return new Response(
            JSON.stringify({ error: "Error interno del servidor" }),
            { status: 500 }
        );
    }
};
