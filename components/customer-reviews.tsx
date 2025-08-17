import { Star } from "lucide-react"

interface Review {
	id: string
	rating: number
	title?: string
	comment: string
	customerName: string
	createdAt: string
	product?: {
		name: string
		id: string
	}
}

interface CustomerReviewsProps {
	reviews: Review[];
}

export function CustomerReviews({ reviews }: CustomerReviewsProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

		if (diffInDays === 0) return "Today"
		if (diffInDays === 1) return "1 day ago"
		if (diffInDays < 7) return `${diffInDays} days ago`
		if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${diffInDays >= 14 ? "s" : ""} ago`
		return `${Math.floor(diffInDays / 30)} month${diffInDays >= 60 ? "s" : ""} ago`
	}

	if (reviews.length === 0) {
		return (
			<section className="bg-[#FFF8E1] py-8 md:py-12">
				<div className="container mx-auto px-4 py-8 md:py-12">
					<h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[hsl(var(--primary))] font-brandon">
						CUSTOMER REVIEWS
					</h2>
					<div className="text-center">
						<p className="text-gray-600 font-brandon">No reviews yet. Be the first to review!</p>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className="bg-[#FFF8E1] py-8 md:py-12">
			<div className="container mx-auto px-4 py-8 md:py-12">
				<h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[hsl(var(--primary))] font-brandon">
					CUSTOMER REVIEWS
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
					{reviews.map((review) => (
						<div
							key={review.id}
							className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
						>
							<div className="flex mb-2">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-5 h-5 ${
											i < review.rating
												? "text-[hsl(var(--primary))] fill-[hsl(var(--primary))]"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
							{review.title && (
								<h3 className="text-lg font-bold mb-2 text-[hsl(var(--primary))] font-brandon">
									{review.title}
								</h3>
							)}
							<p className="text-gray-700 mb-4 font-brandon line-clamp-4">{review.comment}</p>
							<div className="mt-auto">
								<span className="text-sm font-medium text-gray-800 font-brandon">
									{review.customerName}
								</span>
								<span className="text-xs text-gray-400 block font-brandon">
									{formatDate(review.createdAt)}
									{review.product && ` • ${review.product.name}`}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
