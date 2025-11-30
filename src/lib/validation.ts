import { z } from "zod";

export const PublicCatSubmissionSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre no puede exceder 50 caracteres"),
    ageMonths: z
        .number({ invalid_type_error: "La edad debe ser un número" })
        .int("La edad debe ser un número entero")
        .min(0, "La edad no puede ser negativa")
        .max(360, "La edad no puede exceder 360 meses")
        .optional()
        .nullable(),
    sex: z.enum(["MALE", "FEMALE", "UNKNOWN"], {
        errorMap: () => ({ message: "Selecciona un sexo válido" })
    }),

    neighborhood: z.string().min(2, "La colonia debe tener al menos 2 caracteres").max(100, "La colonia no puede exceder 100 caracteres"),

    shortDescription: z.string().min(10, "La descripción corta debe tener al menos 10 caracteres").max(200, "La descripción corta no puede exceder 200 caracteres"),
    fullDescription: z.string().min(20, "La historia debe tener al menos 20 caracteres").max(2000, "La historia no puede exceder 2000 caracteres"),

    sterilized: z.boolean().optional(),
    vaccinesUpToDate: z.boolean().optional(),
    dewormed: z.boolean().optional(),

    rescuerName: z.string().min(2, "El nombre del rescatista debe tener al menos 2 caracteres").max(100, "El nombre del rescatista no puede exceder 100 caracteres"),
    rescuerPhone: z.string().min(8, "El teléfono debe tener al menos 8 caracteres").max(30, "El teléfono no puede exceder 30 caracteres"),
    rescuerEmail: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),

    primaryPhotoUrl: z.string().url("Debe ser una URL válida")
});

export type PublicCatSubmission = z.infer<typeof PublicCatSubmissionSchema>;

export const AdminReviewSchema = z.object({
    action: z.enum(["approve", "reject"])
});

export type AdminReview = z.infer<typeof AdminReviewSchema>;
