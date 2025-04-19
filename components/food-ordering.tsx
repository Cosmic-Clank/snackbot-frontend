"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const popcorns = [
	{ id: "caramel", name: "Caramel Popcorn", image: "/images/caramel-popcorn.png" },
	{ id: "regular", name: "Regular Popcorn", image: "/images/regular-popcorn.png" },
];

const drinks = [
	{ id: "orange-juice", name: "Orange Juice", image: "/images/orange-juice.png" },
	{ id: "coke", name: "Coke", image: "/images/coke.png" },
	{ id: "espresso", name: "Espresso", image: "/images/espresso.png" },
	{ id: "black-coffee", name: "Black Coffee", image: "/images/black-coffee.png" },
];

export default function FoodOrdering({ setConfirmed }: { setConfirmed: (val: boolean) => void }) {
	const [selectedPopcorn, setSelectedPopcorn] = useState<string | null>(null);
	const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
	const [showDialog, setShowDialog] = useState(false);

	const togglePopcorn = (id: string) => {
		setSelectedPopcorn((prev) => (prev === id ? null : id));
	};

	const toggleDrink = (id: string) => {
		setSelectedDrink((prev) => (prev === id ? null : id));
	};

	const confirmOrder = async () => {
		const popcornName = popcorns.find((p) => p.id === selectedPopcorn)?.name || "None";
		const drinkName = drinks.find((d) => d.id === selectedDrink)?.name || "None";

		console.log(`Order placed:\nPopcorn: ${popcornName}\nDrink: ${drinkName}`);

		await fetch("http://localhost:8000/suggestion/clear", {
			method: "POST",
		});

		setConfirmed(false);
		setSelectedPopcorn(null);
		setSelectedDrink(null);
		setShowDialog(false);
	};

	const handleOpenDialog = () => {
		setShowDialog(true);
		setConfirmed(true); // Set confirmed to true when dialog opens
	};

	const popcornName = popcorns.find((p) => p.id === selectedPopcorn)?.name || "None";
	const drinkName = drinks.find((d) => d.id === selectedDrink)?.name || "None";

	return (
		<div className='bg-background flex items-center justify-center'>
			<Card className='w-full'>
				<CardHeader>
					<CardDescription className='text-center'>Pick up to one popcorn and one drink</CardDescription>
				</CardHeader>
				<CardContent className='space-y-10'>
					<div className='flex gap-20 justify-center'>
						<div className='space-y-4'>
							<h2 className='text-3xl font-bold text-center'>🍿 Popcorns</h2>
							<div className='flex flex-col gap-6'>
								{popcorns.map((item) => (
									<div key={item.id} className={cn("w-80 h-96 flex flex-col rounded-xl border cursor-pointer overflow-hidden shadow transition-all", selectedPopcorn === item.id ? "ring-4 ring-primary" : "hover:shadow-xl")} onClick={() => togglePopcorn(item.id)}>
										<div className='relative w-full h-4/5'>
											<Image src={item.image} alt={item.name} fill className='object-contain' />
										</div>
										<div className='flex-grow text-center font-semibold text-lg p-3 flex items-center justify-center'>{item.name}</div>
									</div>
								))}
							</div>
						</div>

						<Separator orientation='vertical' className='w-0.5 bg-muted rounded-4xl' />

						<div className='space-y-4'>
							<h2 className='text-3xl font-bold text-center'>🥤 Drinks</h2>
							<div className='grid grid-cols-2 gap-6'>
								{drinks.map((item) => (
									<div key={item.id} className={cn("w-80 h-96 flex flex-col rounded-xl border cursor-pointer overflow-hidden shadow transition-all", selectedDrink === item.id ? "ring-4 ring-primary" : "hover:shadow-xl")} onClick={() => toggleDrink(item.id)}>
										<div className='relative w-full h-4/5'>
											<Image src={item.image} alt={item.name} fill className='object-contain' />
										</div>
										<div className='flex-grow text-center font-semibold text-lg p-3 flex items-center justify-center'>{item.name}</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{(selectedPopcorn || selectedDrink) && (
						<div className='flex justify-center'>
							<Dialog open={showDialog} onOpenChange={setShowDialog}>
								<DialogTrigger asChild>
									<Button className='text-xl px-8 py-5' onClick={handleOpenDialog}>
										Send To Robots 🤖!
									</Button>
								</DialogTrigger>
								<DialogContent className='sm:max-w-md'>
									<DialogHeader>
										<DialogTitle>Confirm Your Order</DialogTitle>
										<DialogDescription className='text-md'>Make sure everything looks good before we send it off!</DialogDescription>
									</DialogHeader>
									<div className='mt-4 space-y-2 text-lg'>
										<p>
											🍿 Popcorn: <strong>{popcornName}</strong>
										</p>
										<p>
											🥤 Drink: <strong>{drinkName}</strong>
										</p>
									</div>
									<DialogFooter className='mt-6'>
										<Button variant='outline' onClick={() => setShowDialog(false)}>
											Cancel
										</Button>
										<Button onClick={confirmOrder}>Confirm ✅</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
