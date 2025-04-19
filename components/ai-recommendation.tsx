"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Recommendation {
	message: string;
	recommendation: string[];
	image?: string;
}

export default function AIRecommendation({ confirmed }: { confirmed: boolean }) {
	const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
	const [isPolling, setIsPolling] = useState(true);
	const prevConfirmed = useRef(confirmed);

	// Polling effect
	useEffect(() => {
		if (!isPolling) return;

		const poll = async () => {
			try {
				const res = await fetch("http://localhost:8000/suggestion");
				const data = await res.json();

				if (data.available) {
					setRecommendation({
						message: data.message,
						recommendation: data.recommendation,
						image: data.image,
					});
					setIsPolling(false); // Stop polling after getting suggestion
				}
			} catch (err) {
				console.error("Polling error:", err);
			}
		};

		const interval = setInterval(poll, 1000);
		return () => clearInterval(interval);
	}, [isPolling]);

	// Reset state when confirmed transitions from true to false
	useEffect(() => {
		if (prevConfirmed.current && !confirmed) {
			setRecommendation(null);
			// Delay clearing suggestion and resuming polling by 2 seconds
			const timeout = setTimeout(async () => {
				try {
					await fetch("http://localhost:8000/suggestion/clear", {
						method: "POST",
					});
					setIsPolling(true); // Resume polling after clearing
				} catch (err) {
					console.error("Error clearing suggestion:", err);
					setIsPolling(true); // Resume polling even if clear fails
				}
			}, 2000);
			return () => clearTimeout(timeout); // Cleanup timeout on unmount or re-run
		}
		prevConfirmed.current = confirmed;
	}, [confirmed]);

	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-center gap-4'>
				<CardTitle>
					<DotLottieReact src='https://lottie.host/98167173-91d9-4590-b229-c58cddeca85f/iB9c8jNDUV.lottie' loop autoplay />
				</CardTitle>
			</CardHeader>
			<CardContent>
				{recommendation ? (
					<>
						<p className='text-xl font-semibold mb-4 text-foreground'>{recommendation.message}</p>
						<p className='text-lg font-medium mb-4 text-foreground'>I would suggest you to try:</p>
						<div className='grid grid-cols-3 gap-4'>
							{recommendation.recommendation.map((item, index) => (
								<div key={index} className='bg-white border border-primary shadow-sm p-4 rounded-lg text-center'>
									<p className='font-semibold text-primary'>{item}</p>
								</div>
							))}
						</div>
					</>
				) : (
					<div className='text-center text-muted-foreground'>
						<p className='text-lg'>Waiting for a snack-worthy face... 👀</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
