// components/CategorySidebar.js
"use client"
export default function CategorySidebar({ categories, activeCategory, setActiveCategory, activeSubcategory, setActiveSubcategory }) {
    return (
        <aside className="w-64 border-r px-8 py-6 min-h-screen bg-white">
            <nav className="space-y-4">
                {categories.map(cat => (
                    <div key={cat.id}>
                        <button
                            onClick={() => setActiveCategory(cat.id)}
                            className={`text-lg font-bold uppercase mb-2 ${activeCategory === cat.id ? "text-[hsl(var(--primary))]" : "text-gray-700"}`}
                        >
                            {cat.name}
                        </button>
                        {activeCategory === cat.id && (
                            <ul className="pl-4 space-y-1">
                                {cat.subcategories.map(sub => (
                                    <li key={sub.id}>
                                        <button
                                            onClick={() => setActiveSubcategory(sub.slug)}
                                            className={`block text-base ${activeSubcategory === sub.slug ? "font-bold text-black" : "text-gray-600"}`}
                                        >
                                            {sub.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    )
}
