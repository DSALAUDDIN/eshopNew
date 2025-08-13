// components/ProductCard.js
import { Button } from "@/components/ui/button"

export default function ProductCard({ product, onViewDetails }) {
    // Parse images from JSON string to get the first image
    const getProductImage = () => {
        try {
            if (typeof product.images === 'string') {
                const parsedImages = JSON.parse(product.images)
                return parsedImages[0] || product.image || '/placeholder.jpg'
            } else if (Array.isArray(product.images)) {
                return product.images[0] || '/placeholder.jpg'
            } else {
                return product.image || '/placeholder.jpg'
            }
        } catch (error) {
            return product.image || '/placeholder.jpg'
        }
    }

    return (
        <div className="flex gap-6 p-4 border rounded shadow-sm bg-white hover:shadow-lg transition">
            <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                <img src={getProductImage()} alt={product.name} className="w-full h-full object-contain rounded"/>
            </div>
            <div className="flex flex-col justify-between">
                <div>
                    <span className="text-xs text-green-500 font-semibold">NEW!</span>
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="text-gray-500 text-sm mb-1">
                        Product code: {product.code}<br/>
                        Barcode: {product.barcode}<br/>
                        {product.stock} in stock
                    </p>
                </div>
                <Button onClick={() => onViewDetails(product.id)} className="bg-[#21726D] text-white px-8 py-2 rounded">
                    View Details
                </Button>
            </div>
        </div>
    )
}
