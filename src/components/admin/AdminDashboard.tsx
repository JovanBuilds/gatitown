import { useState, useEffect } from "react";

interface Cat {
    id: string;
    name: string;
    ageMonths: number | null;
    sex: string;
    neighborhood: string;
    city: string;
    rescuerName: string;
    rescuerPhone: string;
    adoptionStatus: string;
    reviewStatus: string;
    createdAt: string;
    photos: Array<{
        id: string;
        url: string;
        isPrimary: boolean;
    }>;
}

interface Stats {
    total: number;
    available: number;
    reserved: number;
    adopted: number;
    pending: number;
}

export default function AdminDashboard() {
    const [pendingCats, setPendingCats] = useState<Cat[]>([]);
    const [approvedCats, setApprovedCats] = useState<Cat[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        available: 0,
        reserved: 0,
        adopted: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pendingRes, approvedRes] = await Promise.all([
                fetch("/api/admin/cats/pending"),
                fetch("/api/admin/cats/approved")
            ]);

            if (pendingRes.ok && approvedRes.ok) {
                const pending = await pendingRes.json();
                const approved = await approvedRes.json();

                setPendingCats(pending);
                setApprovedCats(approved);

                // Calculate stats
                const available = approved.filter((c: Cat) => c.adoptionStatus === "AVAILABLE").length;
                const reserved = approved.filter((c: Cat) => c.adoptionStatus === "RESERVED").length;
                const adopted = approved.filter((c: Cat) => c.adoptionStatus === "ADOPTED").length;

                setStats({
                    total: pending.length + approved.length,
                    available,
                    reserved,
                    adopted,
                    pending: pending.length
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (catId: string, action: "approve" | "reject") => {
        const confirmMessage = action === "approve"
            ? "¿Aprobar este gatito?"
            : "¿Rechazar este gatito?";

        if (!confirm(confirmMessage)) return;

        try {
            const response = await fetch(`/api/admin/cats/${catId}/review`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            });

            if (response.ok) {
                fetchData(); // Refresh data
            } else {
                alert("Error al procesar la solicitud");
            }
        } catch (error) {
            console.error("Error reviewing cat:", error);
            alert("Error de conexión");
        }
    };

    const handleAdoptionStatusChange = async (catId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/cats/${catId}/adoption-status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adoptionStatus: newStatus })
            });

            if (response.ok) {
                fetchData(); // Refresh data
            } else {
                alert("Error al actualizar el estado");
            }
        } catch (error) {
            console.error("Error updating adoption status:", error);
            alert("Error de conexión");
        }
    };

    const formatAge = (months: number | null) => {
        if (!months) return "Edad desconocida";
        if (months < 12) return `${months} ${months === 1 ? "mes" : "meses"}`;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (remainingMonths === 0) return `${years} ${years === 1 ? "año" : "años"}`;
        return `${years} ${years === 1 ? "año" : "años"} y ${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Cargando dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-[#9A7B6A]">
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-3xl font-bold text-[#9A7B6A]">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Disponibles</p>
                    <p className="text-3xl font-bold text-green-600">{stats.available}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-600 mb-1">Reservados</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.reserved}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">Adoptados</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.adopted}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                </div>
            </div>

            {/* Pending Cats */}
            {pendingCats.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-[#9A7B6A] mb-6">
                        Gatitos pendientes de aprobación
                    </h2>
                    <div className="space-y-4">
                        {pendingCats.map((cat) => {
                            const primaryPhoto = cat.photos.find(p => p.isPrimary) || cat.photos[0];
                            return (
                                <div key={cat.id} className="flex items-center gap-4 p-4 bg-[#FFF4EA] rounded-xl">
                                    <img
                                        src={primaryPhoto?.url || "/placeholder-cat.jpg"}
                                        alt={cat.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{cat.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {formatAge(cat.ageMonths)} • {cat.neighborhood}, {cat.city}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Rescatista: {cat.rescuerName} ({cat.rescuerPhone})
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Enviado: {formatDate(cat.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleReview(cat.id, "approve")}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Aprobar
                                        </button>
                                        <button
                                            onClick={() => handleReview(cat.id, "reject")}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Approved Cats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#9A7B6A] mb-6">
                    Gatitos aprobados - Gestión de adopciones
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedCats.map((cat) => {
                        const primaryPhoto = cat.photos.find(p => p.isPrimary) || cat.photos[0];
                        return (
                            <div key={cat.id} className="border border-gray-200 rounded-xl p-4">
                                <img
                                    src={primaryPhoto?.url || "/placeholder-cat.jpg"}
                                    alt={cat.name}
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                />
                                <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {cat.neighborhood}, {cat.city}
                                </p>
                                <select
                                    value={cat.adoptionStatus}
                                    onChange={(e) => handleAdoptionStatusChange(cat.id, e.target.value)}
                                    className="w-full px-3 py-2 bg-[#FFF4EA] border-none rounded-lg focus:ring-2 focus:ring-[#A8D8E8] outline-none text-sm"
                                >
                                    <option value="AVAILABLE">Disponible</option>
                                    <option value="RESERVED">Reservado</option>
                                    <option value="ADOPTED">Adoptado</option>
                                </select>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
