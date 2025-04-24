"use client";

import AIRecommendation from "@/components/ai-recommendation";
import TopBanner from "@/components/banner";
import FoodOrdering from "@/components/food-ordering";
import LiveOrders from "@/components/live-orders";

export default function Home() {
	return (
		<main className='min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col gap-4'>
			<TopBanner />
			<div className='flex flex-col md:flex-row gap-6'>
				{/* Sidebar for AIRecommendation */}
				<div className='w-full md:w-80 lg:w-96 flex-shrink-0'>
					<AIRecommendation />
				</div>
				{/* Main content for FoodOrdering */}
				<div className='flex-1'>
					<FoodOrdering />
				</div>

				{/* Placeholder for LiveOrders */}
				<div className='w-full md:w-80 lg:w-96 flex-shrink-0'>
					<LiveOrders />
				</div>
			</div>
		</main>
	);
}
