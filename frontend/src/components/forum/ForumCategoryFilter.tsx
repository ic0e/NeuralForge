export interface ForumCategory {
    id: string;
    label: string;
    icon: string;
    count?: number;
}

interface ForumCategoryFilterProps {
    categories: ForumCategory[];
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

function ForumCategoryFilter({ categories, activeCategory, onCategoryChange }: ForumCategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
                        transition-all duration-250 ease-out border
                        ${isActive
                                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                                : 'bg-gray-900/40 text-gray-400 border-gray-700/40 hover:text-white hover:bg-gray-800/60 hover:border-gray-600/50'
                            }`}
                        onClick={() => onCategoryChange(cat.id)}
                    >
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.label}</span>
                        {cat.count !== undefined && (
                            <span className={`ml-0.5 text-[11px] px-1.5 py-0.5 rounded-full font-medium
                              ${isActive
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'bg-gray-700/50 text-gray-500'
                                }`}>
                                {cat.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default ForumCategoryFilter;
