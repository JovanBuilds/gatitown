import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";
import { lucia } from "../../../../lib/auth";

export const GET: APIRoute = async ({ cookies }) => {
    const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (!session || user.role !== "ADMIN") {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const approvedCats = await prisma.cat.findMany({
            where: {
                reviewStatus: "APPROVED"
            },
            include: {
                photos: {
                    orderBy: {
                        isPrimary: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return new Response(
            JSON.stringify(approvedCats),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("Error fetching approved cats:", error);
        return new Response(
            JSON.stringify({
                error: "Internal server error"
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
};
