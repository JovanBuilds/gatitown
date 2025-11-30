import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const POST: APIRoute = async ({ request }) => {
    try {
        // Check content type
        const contentType = request.headers.get("content-type");
        if (!contentType || !contentType.includes("multipart/form-data")) {
            return new Response(JSON.stringify({ error: "Content-Type must be multipart/form-data" }), { status: 400 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
        }

        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: "El archivo es demasiado grande (máx 5MB)" }), { status: 400 });
        }

        // Validate type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({ error: "Tipo de archivo no válido. Solo se permiten JPEG, PNG y WEBP." }), { status: 400 });
        }

        const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
        const fileName = `${randomUUID()}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", "cats");

        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));

        return new Response(JSON.stringify({ url: `/uploads/cats/${fileName}` }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Upload error:", error);
        return new Response(JSON.stringify({ error: "Error interno del servidor al subir la imagen" }), { status: 500 });
    }
};
