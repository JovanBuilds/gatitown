interface CatCardProps {
    cat: {
        id: string;
        name: string;
        ageMonths: number | null;
        neighborhood: string;
        shortDescription: string;
        sterilized: boolean;
        vaccinesUpToDate: boolean;
        dewormed: boolean;
        photos: Array<{
            id: string;
            url: string;
            isPrimary: boolean;
        }>;
    };
    onViewDetails: (cat: any) => void;
}

export default function CatCard({ cat, onViewDetails }: CatCardProps) {
    const primaryPhoto = cat.photos.find(p => p.isPrimary) || cat.photos[0];

    const formatAge = (months: number | null) => {
        if (!months) return "Edad desconocida";
        if (months < 12) return `${months} meses`;
        const years = Math.floor(months / 12);
        return `${years} ${years === 1 ? "año" : "años"}`;
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="relative h-64">
                <img
                    src={primaryPhoto?.url || "/placeholder-cat.jpg"}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                    {formatAge(cat.ageMonths)} • {cat.neighborhood}
                </p>

                <p className="text-gray-700 mb-4 line-clamp-2">{cat.shortDescription}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {cat.sterilized && (
                        <span className="px-2 py-1 bg-[#F7C8B6] text-gray-800 rounded-full text-xs font-medium">
                            Esterilizado
                        </span>
                    )}
                    {cat.vaccinesUpToDate && (
                        <span className="px-2 py-1 bg-[#A8D8E8] text-gray-800 rounded-full text-xs font-medium">
                            Vacunas al día
                        </span>
                    )}
                    {cat.dewormed && (
                        <span className="px-2 py-1 bg-[#FFF4EA] text-gray-800 rounded-full text-xs font-medium border border-gray-200">
                            Desparasitado
                        </span>
                    )}
                </div>

                <button
                    onClick={() => onViewDetails(cat)}
                    className="w-full bg-[#A8D8E8] hover:bg-[#F7C8B6] text-gray-900 font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                    Ver ficha
                </button>
            </div>
        </div>
    );
}
