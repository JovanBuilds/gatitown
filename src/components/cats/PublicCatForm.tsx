import { useState } from "react";
import type { PublicCatSubmission } from "../../lib/validation";

export default function PublicCatForm() {
    const [formData, setFormData] = useState<Partial<PublicCatSubmission>>({
        sex: "UNKNOWN",
        sterilized: false,
        vaccinesUpToDate: false,
        dewormed: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const payload = {
                ...formData,
                ageMonths: formData.ageMonths ? Number(formData.ageMonths) : null
            };

            const response = await fetch("/api/public/cats/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: "¡Gracias! Tu gatito ha sido enviado para revisión. Te contactaremos pronto."
                });
                // Reset form
                setFormData({
                    sex: "UNKNOWN",
                    sterilized: false,
                    vaccinesUpToDate: false,
                    dewormed: false
                });
            } else {
                setMessage({
                    type: "error",
                    text: data.details ? data.details.map((d: any) => d.message).join(", ") : "Hubo un error al enviar el formulario"
                });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: "Error de conexión. Por favor intenta de nuevo."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#9A7B6A] mb-3">
                ¿Tienes un gatito en adopción?
            </h2>
            <p className="text-gray-600 mb-8">
                Ayúdanos a encontrarle un hogar llenando este formulario.
            </p>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-lg ${message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información del gatito */}
                <section>
                    <h3 className="text-xl font-semibold text-[#9A7B6A] mb-4">Información del gatito</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del gatito <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-xl focus:ring-2 focus:ring-[#A8D8E8] outline-none"
                                placeholder="Ej. Michi"
                            />
                        </div>

                        <div>
                            <label htmlFor="ageMonths" className="block text-sm font-medium text-gray-700 mb-2">
                                Edad aproximada (meses)
                            </label>
                            <input
                                type="number"
                                id="ageMonths"
                                name="ageMonths"
                                min="0"
                                max="360"
                                value={formData.ageMonths || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-xl focus:ring-2 focus:ring-[#A8D8E8] outline-none"
                                placeholder="Ej. 6"
                            />
                        </div>

                        <div>
                            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
                                Sexo <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="sex"
                                name="sex"
                                required
                                value={formData.sex || "UNKNOWN"}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-xl focus:ring-2 focus:ring-[#A8D8E8] outline-none"
                            >
                                <option value="FEMALE">Hembra</option>
                                <option value="MALE">Macho</option>
                                <option value="UNKNOWN">No estoy seguro</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                                Colonia <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="neighborhood"
                                name="neighborhood"
                                required
                                value={formData.neighborhood || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-xl focus:ring-2 focus:ring-[#A8D8E8] outline-none"
                                placeholder="Ej. Zona Centro"
                            />
                        </div>
                    </div>
                </section>

                {/* Salud */}
                <section>
                    <h3 className="text-xl font-semibold text-[#9A7B6A] mb-4">Salud</h3>
                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="sterilized"
                                checked={formData.sterilized || false}
                                onChange={handleChange}
                                className="w-5 h-5 text-[#A8D8E8] rounded focus:ring-[#A8D8E8]"
                            />
                            <span className="text-sm font-medium text-gray-700">Esterilizado</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="vaccinesUpToDate"
                                checked={formData.vaccinesUpToDate || false}
                                onChange={handleChange}
                                className="w-5 h-5 text-[#A8D8E8] rounded focus:ring-[#A8D8E8]"
                            />
                            <span className="text-sm font-medium text-gray-700">Vacunas al día</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="dewormed"
                                checked={formData.dewormed || false}
                                onChange={handleChange}
                                className="w-5 h-5 text-[#A8D8E8] rounded focus:ring-[#A8D8E8]"
                            />
                            <span className="text-sm font-medium text-gray-700">Desparasitado</span>
                        </label>
                    </div>
                </section>

                {/* Descripción */}
                <section>
                    <h3 className="text-xl font-semibold text-[#9A7B6A] mb-4">Descripción</h3>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción corta <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="shortDescription"
                                name="shortDescription"
                                required
                                value={formData.shortDescription || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-xl focus:ring-2 focus:ring-[#A8D8E8] outline-none"
                                placeholder="Una frase que describa al gatito"
                                maxLength={200}
                            />
                        </div>

                        <div>
                            <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                Historia y detalles <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="fullDescription"
                                name="fullDescription"
                                required
                                value={formData.fullDescription || ""}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-2xl focus:ring-2 focus:ring-[#A8D8E8] outline-none resize-vertical"
                                placeholder="Cuéntanos sobre su personalidad, cómo lo encontraste, etc."
                                maxLength={2000}
                            />
                        </div>
                    </div>
                </section>

                {/* Foto */}
                <section>
                    <h3 className="text-xl font-semibold text-[#9A7B6A] mb-4">Foto</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subir foto del gatito
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    setUploading(true);
                                    const uploadData = new FormData();
                                    uploadData.append("file", file);

                                    try {
                                        const res = await fetch("/api/uploads/cat-photo", {
                                            method: "POST",
                                            body: uploadData
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            setFormData(prev => ({ ...prev, primaryPhotoUrl: data.url }));
                                        } else {
                                            alert(data.error || "Error al subir la imagen");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error de conexión al subir imagen");
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-[#A8D8E8] file:text-gray-900
                                    hover:file:bg-[#F7C8B6]
                                "
                            />
                            {uploading && <p className="text-sm text-blue-600 mt-2">Subiendo imagen...</p>}
                        </div>

                        {formData.primaryPhotoUrl && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                                <img
                                    src={formData.primaryPhotoUrl}
                                    alt="Vista previa"
                                    className="w-full max-w-xs h-48 object-cover rounded-xl shadow-md"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="primaryPhotoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                o pega una URL de la foto
                            </label>
                            <input
                                type="url"
                                id="primaryPhotoUrl"
                                name="primaryPhotoUrl"
                                value={formData.primaryPhotoUrl || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-xl focus:ring-2 focus:ring-[#A8D8E8] outline-none"
                                placeholder="https://ejemplo.com/foto.jpg"
                            />
                        </div>
                    </div>
                </section>

                {/* Rescatista */}
                <section>
                    <h3 className="text-xl font-semibold text-[#9A7B6A] mb-4">Rescatista</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="rescuerName" className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del rescatista <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="rescuerName"
                                name="rescuerName"
                                required
                                value={formData.rescuerName || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-xl focus:ring-2 focus:ring-[#A8D8E8] outline-none"
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div>
                            <label htmlFor="rescuerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                Teléfono / WhatsApp del rescatista <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="rescuerPhone"
                                name="rescuerPhone"
                                required
                                value={formData.rescuerPhone || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-xl focus:ring-2 focus:ring-[#A8D8E8] outline-none"
                                placeholder="664-123-4567"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="rescuerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo del rescatista (opcional)
                            </label>
                            <input
                                type="email"
                                id="rescuerEmail"
                                name="rescuerEmail"
                                value={formData.rescuerEmail || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#FFF4EA] border-none rounded-xl focus:ring-2 focus:ring-[#A8D8E8] outline-none"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-[#A8D8E8] hover:bg-[#F7C8B6] text-gray-900 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isSubmitting ? "Enviando..." : "Enviar para revisión"}
                </button>
            </form>
        </div>
    );
}
