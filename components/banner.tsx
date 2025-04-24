"use client";
import localFont from "next/font/local";

// Font files can be colocated inside of `pages`

import { Card, CardContent } from "@/components/ui/card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { cn } from "@/lib/utils";

const myFont = localFont({ src: "./quartzo.ttf" });

export default function TopBanner() {
	return (
		<Card className='w-full border-none shadow-md bg-muted py-6'>
			<CardContent className='flex items-center justify-between gap-6 px-6'>
				{/* Left Lottie */}
				<div className='hidden md:flex w-28 h-28'>
					<DotLottieReact src='https://lottie.host/69860885-b7ba-42b9-a4d5-32c19c8aa522/1gATuOlv2J.lottie' loop autoplay className='w-full h-full' />
				</div>

				{/* Title */}
				<h1 className={cn("text-center text-3xl md:text-5xl font-extrabold tracking-tight text-foreground flex-1", myFont.className)}>AUTONOMOUS SNACKBOT</h1>

				{/* Right Lottie */}
				<div className='hidden md:flex w-28 h-28'>
					<DotLottieReact src='https://lottie.host/69860885-b7ba-42b9-a4d5-32c19c8aa522/1gATuOlv2J.lottie' loop autoplay className='w-full h-full' />
				</div>
			</CardContent>
		</Card>
	);
}
