import type { APIRoute } from "astro";
import { prisma } from "../../../../../lib/prisma";
import { lucia } from "../../../../../lib/auth";
import { AdminReviewSchema } from "../../../../../lib/validation";
import { ZodError } from "zod";

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
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

    const catId = params.id;

    if (!catId) {
        return new Response(JSON.stringify({ error: "Cat ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const body = await request.json();
        const { action } = AdminReviewSchema.parse(body);

        const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

        const updatedCat = await prisma.cat.update({
            where: { id: catId },
            data: {
                reviewStatus: newStatus
            },
            include: {
                photos: true
            }
        });

        return new Response(
            JSON.stringify({
                message: `Cat ${action}d successfully`,
                cat: updatedCat
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response(
                JSON.stringify({
                    error: "Validation failed",
                    details: error.errors
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        console.error("Error reviewing cat:", error);
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
