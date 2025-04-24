"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion, AnimatePresence } from "framer-motion";

interface Recommendation {
	message: string;
	recommendation: string[];
	image?: string;
}

export default function AIRecommendation() {
	const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
	const isMounted = useRef(true);

	useEffect(() => {
		const poll = async () => {
			try {
				const res = await fetch("http://192.168.1.126:8001/suggestion");
				const data = await res.json();

				if (data.available && isMounted.current) {
					setRecommendation({
						message: data.message,
						recommendation: data.recommendation,
						image: data.image,
					});
				}
			} catch (err) {
				console.error("Polling error:", err);
			}
		};

		const interval = setInterval(poll, 1000);
		return () => {
			isMounted.current = false;
			clearInterval(interval);
		};
	}, []);

	return (
		<Card className='h-full overflow-y-auto border-none shadow-lg bg-white'>
			<CardContent className='p-6 flex flex-col gap-6'>
				{/* 🧠 Instructions */}
				<div className='bg-orange-500 p-4 rounded-lg shadow-xl text-white'>
					<h3 className='text-xl font-bold mb-3 tracking-tight'>How It Works</h3>
					<div className='space-y-3'>
						{[
							{ emoji: "👀", title: "Let the camera see you" },
							{ emoji: "✨", title: "Get your snack suggestion" },
							{ emoji: "🤖", title: "Place your order" },
						].map((step, index) => (
							<motion.div key={`step-${index}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} className='flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/20'>
								<div className='w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center font-bold'>{index + 1}</div>
								<p className='font-medium text-white text-sm flex items-center gap-2'>
									<span>{step.emoji}</span> {step.title}
								</p>
							</motion.div>
						))}
					</div>
				</div>

				{/* 🤖 Bot with Talking Bubble */}
				<AnimatePresence>
					{recommendation ? (
						<motion.div key={recommendation.message} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className='flex flex-col items-center gap-6'>
							{/* 💬 Speech Bubble */}
							<div className='relative max-w-3xl w-full'>
								<div className='relative bg-white border border-gray-200 p-6 rounded-2xl shadow text-center'>
									<div className='mb-4 text-lg font-semibold text-gray-900 flex items-center justify-center gap-2'>
										<span>{recommendation.message}</span>
									</div>

									{/* 🍿 Suggestions with EMOJIS + primary color */}
									<p className='text-base font-medium text-gray-600 mb-4'>I suggest you order</p>
									<div className='flex flex-wrap justify-center gap-3'>
										{recommendation.recommendation.map((item, index) => {
											const lower = item.toLowerCase();
											const emoji = lower.includes("popcorn") ? "🍿" : lower.includes("juice") ? "🧃" : lower.includes("coffee") || lower.includes("espresso") ? "☕" : "✨";

											return (
												<div key={index} className='bg-primary text-primary-foreground px-4 py-2 rounded-xl text-lg font-semibold shadow transition-all'>
													{emoji} {item}
												</div>
											);
										})}
									</div>

									{/* 🔽 Bubble Arrow */}
									<div className='absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white' />
								</div>
							</div>

							{/* 🤖 BIG Robot */}
							<div className='w-52 h-52'>
								<DotLottieReact src='https://lottie.host/50926838-080e-4166-b114-2c56f5a67640/c0yTAfqVLL.lottie' loop autoplay className='w-full h-full' />
							</div>
						</motion.div>
					) : (
						<motion.div key='idle' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex-1 flex items-center justify-center'>
							<div className='bg-white border border-gray-200 p-4 rounded-lg shadow text-sm font-semibold text-gray-800'>Waiting for a snack-worthy face... 👀</div>
						</motion.div>
					)}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}
