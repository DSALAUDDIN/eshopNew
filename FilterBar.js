// components/FilterBar.js
export default function FilterBar({ total, onSort, onFilter }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
                <select className="border rounded px-3 py-1" onChange={e => onSort(e.target.value)}>
                    <option value="">Sort by</option>
                    <option value="newest">Newest</option>
                    <option value="priceLow">Price (Low to High)</option>
                    <option value="priceHigh">Price (High to Low)</option>
                </select>
                <select className="border rounded px-3 py-1" onChange={e => onFilter(e.target.value)}>
                    <option value="">Filter by</option>
                    <option value="inStock">In stock</option>
                    <option value="outStock">Out of stock</option>
                </select>
            </div>
            <div>
                <span className="text-gray-500">{total} Total</span>
            </div>
        </div>
    )
}
