import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";

export const GET: APIRoute = async () => {
    try {
        const cats = await prisma.cat.findMany({
            where: {
                reviewStatus: "APPROVED",
                adoptionStatus: "AVAILABLE"
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
            JSON.stringify(cats),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("Error fetching cats:", error);
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
