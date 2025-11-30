import { useState, useEffect } from "react";

interface PendingCat {
    id: string;
    name: string;
    ageMonths: number | null;
    neighborhood: string;
    rescuerName: string;
    rescuerPhone: string;
    createdAt: string;
    photos: Array<{
        id: string;
        url: string;
        isPrimary: boolean;
    }>;
}

export default function PendingList({ client }: { client: "load" }) {
    const [cats, setCats] = useState<PendingCat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingCats();
    }, []);

    const fetchPendingCats = async () => {
        try {
            const response = await fetch("/api/admin/cats/pending");
            if (response.ok) {
                const data = await response.json();
                setCats(data);
            } else if (response.status === 401 || response.status === 403) {
                setError("No tienes permisos para ver esta página");
            } else {
                setError("Error al cargar los gatitos pendientes");
            }
        } catch (error) {
            console.error("Error fetching pending cats:", error);
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (catId: string, action: "approve" | "reject") => {
        const confirmMessage = action === "approve"
            ? "¿Estás seguro de aprobar este gatito?"
            : "¿Estás seguro de rechazar este gatito?";

        if (!confirm(confirmMessage)) return;

        try {
            const response = await fetch(`/api/admin/cats/${catId}/review`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ action })
            });

            if (response.ok) {
                // Remove from list
                setCats(cats.filter(cat => cat.id !== catId));
                alert(`Gatito ${action === "approve" ? "aprobado" : "rechazado"} exitosamente`);
            } else {
                alert("Error al procesar la solicitud");
            }
        } catch (error) {
            console.error("Error reviewing cat:", error);
            alert("Error de conexión");
        }
    };

    const formatAge = (months: number | null) => {
        if (!months) return "Edad desconocida";
        if (months < 12) return `${months} meses`;
        const years = Math.floor(months / 12);
        return `${years} ${years === 1 ? "año" : "años"}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Cargando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (cats.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No hay gatitos pendientes de aprobación</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#FFF4EA]">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Foto</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Edad</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Colonia</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rescatista</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {cats.map((cat) => {
                            const primaryPhoto = cat.photos.find(p => p.isPrimary) || cat.photos[0];

                            return (
                                <tr key={cat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img
                                            src={primaryPhoto?.url || "/placeholder-cat.jpg"}
                                            alt={cat.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{cat.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {formatAge(cat.ageMonths)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {cat.neighborhood}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {cat.rescuerName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {cat.rescuerPhone}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {formatDate(cat.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReview(cat.id, "approve")}
                                                className="px-4 py-2 bg-[#A8D8E8] hover:bg-[#8BC8D8] text-gray-900 font-medium rounded-lg transition-colors"
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => handleReview(cat.id, "reject")}
                                                className="px-4 py-2 bg-[#F7C8B6] hover:bg-[#E7B8A6] text-gray-900 font-medium rounded-lg transition-colors"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
