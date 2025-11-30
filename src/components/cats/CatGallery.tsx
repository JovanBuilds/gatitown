import { useState, useEffect } from "react";
import CatCard from "./CatCard";

interface Cat {
    id: string;
    name: string;
    ageMonths: number | null;
    sex: string;
    neighborhood: string;
    shortDescription: string;
    fullDescription: string;
    sterilized: boolean;
    vaccinesUpToDate: boolean;
    dewormed: boolean;
    rescuerName: string;
    rescuerPhone: string;
    rescuerEmail: string | null;
    photos: Array<{
        id: string;
        url: string;
        isPrimary: boolean;
    }>;
}

export default function CatGallery() {
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState<Cat | null>(null);

    useEffect(() => {
        fetchCats();
    }, []);

    const fetchCats = async () => {
        try {
            const response = await fetch("/api/public/cats");
            if (response.ok) {
                const data = await response.json();
                setCats(data);
            }
        } catch (error) {
            console.error("Error fetching cats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Cargando gatitos...</p>
            </div>
        );
    }

    if (cats.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No hay gatitos disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cats.map((cat) => (
                    <CatCard key={cat.id} cat={cat} onViewDetails={setSelectedCat} />
                ))}
            </div>

            {selectedCat && (
                <CatDetailModal cat={selectedCat} onClose={() => setSelectedCat(null)} />
            )}
        </>
    );
}

function CatDetailModal({ cat, onClose }: { cat: Cat; onClose: () => void }) {
    const primaryPhoto = cat.photos.find(p => p.isPrimary) || cat.photos[0];

    const formatAge = (months: number | null) => {
        if (!months) return "Edad desconocida";
        if (months < 12) return `${months} ${months === 1 ? "mes" : "meses"}`;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (remainingMonths === 0) return `${years} ${years === 1 ? "año" : "años"}`;
        return `${years} ${years === 1 ? "año" : "años"} y ${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}`;
    };

    const formatSex = (sex: string) => {
        switch (sex) {
            case "MALE": return "Macho";
            case "FEMALE": return "Hembra";
            default: return "No estoy seguro";
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <img
                        src={primaryPhoto?.url || "/placeholder-cat.jpg"}
                        alt={cat.name}
                        className="w-full h-96 object-cover rounded-t-3xl"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[#9A7B6A] mb-2">{cat.name}</h2>
                            <p className="text-gray-600">{formatAge(cat.ageMonths)} • {formatSex(cat.sex)}</p>
                            <p className="text-gray-600">{cat.neighborhood}, Tijuana</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {cat.sterilized && (
                            <span className="px-3 py-1 bg-[#F7C8B6] text-gray-800 rounded-full text-sm font-medium">
                                Esterilizado
                            </span>
                        )}
                        {cat.vaccinesUpToDate && (
                            <span className="px-3 py-1 bg-[#A8D8E8] text-gray-800 rounded-full text-sm font-medium">
                                Vacunas al día
                            </span>
                        )}
                        {cat.dewormed && (
                            <span className="px-3 py-1 bg-[#FFF4EA] text-gray-800 rounded-full text-sm font-medium border border-gray-200">
                                Desparasitado
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-[#9A7B6A] mb-2">Sobre {cat.name}</h3>
                        <p className="text-gray-700 mb-4">{cat.shortDescription}</p>
                        <p className="text-gray-600 whitespace-pre-line">{cat.fullDescription}</p>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-xl font-semibold text-[#9A7B6A] mb-4">Contacto del rescatista</h3>
                        <div className="space-y-2">
                            <p className="text-gray-700">
                                <span className="font-medium">Nombre:</span> {cat.rescuerName}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Teléfono:</span> {cat.rescuerPhone}
                            </p>
                            {cat.rescuerEmail && (
                                <p className="text-gray-700">
                                    <span className="font-medium">Correo:</span> {cat.rescuerEmail}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-6 w-full bg-[#A8D8E8] hover:bg-[#F7C8B6] text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
