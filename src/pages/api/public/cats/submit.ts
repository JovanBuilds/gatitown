import type { APIRoute } from "astro";
import { prisma } from "../../../../lib/prisma";
import { PublicCatSubmissionSchema } from "../../../../lib/validation";
import { ZodError } from "zod";

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        // Validate the request body
        const validatedData = PublicCatSubmissionSchema.parse(body);

        // Create the cat record
        const cat = await prisma.cat.create({
            data: {
                name: validatedData.name,
                ageMonths: validatedData.ageMonths ?? null,
                sex: validatedData.sex,
                neighborhood: validatedData.neighborhood,
                city: "Tijuana",
                shortDescription: validatedData.shortDescription,
                fullDescription: validatedData.fullDescription,
                sterilized: validatedData.sterilized ?? false,
                vaccinesUpToDate: validatedData.vaccinesUpToDate ?? false,
                dewormed: validatedData.dewormed ?? false,
                rescuerName: validatedData.rescuerName,
                rescuerPhone: validatedData.rescuerPhone,
                rescuerEmail: validatedData.rescuerEmail || null,
                adoptionStatus: "AVAILABLE",
                reviewStatus: "PENDING",
                photos: {
                    create: {
                        url: validatedData.primaryPhotoUrl,
                        isPrimary: true
                    }
                }
            },
            include: {
                photos: true
            }
        });

        return new Response(
            JSON.stringify({
                message: "Cat submitted for review",
                id: cat.id
            }),
            {
                status: 201,
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
                    details: error.errors.map(err => ({
                        field: err.path.join("."),
                        message: err.message
                    }))
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        console.error("Error submitting cat:", error);
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
