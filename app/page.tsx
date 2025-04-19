"use client";
import AIRecommendation from "@/components/ai-recommendation";
import FoodOrdering from "@/components/food-ordering";
import { useState } from "react";

export default function Home() {
	const [confirmed, setConfirmed] = useState(false);

	return (
		<main className='min-h-screen p-8'>
			<div className='max-w-7xl mx-auto flex flex-col gap-8'>
				<AIRecommendation confirmed={confirmed} />
				<FoodOrdering setConfirmed={setConfirmed} />
			</div>
		</main>
	);
}
