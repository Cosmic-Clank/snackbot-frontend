"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
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

export default function FoodOrdering() {
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

		const orderItems = [];
		if (selectedPopcorn) orderItems.push({ item_name: popcornName, quantity: 1 });
		if (selectedDrink) orderItems.push({ item_name: drinkName, quantity: 1 });

		if (orderItems.length > 0) {
			try {
				const response = await fetch("http://192.168.1.126:8000/order", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ items: orderItems }),
				});
				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
				}
				const data = await response.json();
				console.log("Order sent successfully:", data);
			} catch (err) {
				console.error("Error sending order:", err);
			}
		}

		setSelectedPopcorn(null);
		setSelectedDrink(null);
		setShowDialog(false);
	};

	const popcornName = popcorns.find((p) => p.id === selectedPopcorn)?.name || "None";
	const drinkName = drinks.find((d) => d.id === selectedDrink)?.name || "None";

	return (
		<div className='bg-background flex items-center justify-center'>
			<Card className='w-full border-none shadow-lg bg-muted'>
				<CardHeader>
					<CardDescription className='text-center text-base font-semibold text-foreground'>Pick up to one popcorn and one drink</CardDescription>
				</CardHeader>

				<CardContent className='space-y-8 p-4'>
					<div className='flex gap-6 justify-center flex-col md:flex-row'>
						{/* Popcorn Section */}
						<div className='space-y-3'>
							<h2 className='text-lg font-bold text-foreground text-center'>🍿 Popcorns</h2>
							<div className='flex flex-col gap-3'>
								{popcorns.map((item) => (
									<div key={item.id} className={`w-60 h-72 flex flex-col rounded-lg border bg-white cursor-pointer overflow-hidden shadow-md ${selectedPopcorn === item.id ? "ring-2 ring-primary" : ""}`} onClick={() => togglePopcorn(item.id)}>
										<div className='relative w-full h-3/4'>
											<Image src={item.image} alt={item.name} fill className='object-contain p-3' />
										</div>
										<div className='text-center font-semibold text-foreground p-2 text-sm'>{item.name}</div>
									</div>
								))}
							</div>
						</div>

						<Separator orientation='vertical' className='w-px bg-border hidden md:block' />

						{/* Drink Section */}
						<div className='space-y-3'>
							<h2 className='text-lg font-bold text-foreground text-center'>🥤 Drinks</h2>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
								{drinks.map((item) => (
									<div key={item.id} className={`w-60 h-72 flex flex-col rounded-lg border bg-white cursor-pointer overflow-hidden shadow-md ${selectedDrink === item.id ? "ring-2 ring-primary" : ""}`} onClick={() => toggleDrink(item.id)}>
										<div className='relative w-full h-3/4'>
											<Image src={item.image} alt={item.name} fill className='object-contain p-3' />
										</div>
										<div className='text-center font-semibold text-foreground p-2 text-sm'>{item.name}</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Order Button + Dialog */}
					<div className='flex justify-center pt-6'>
						<Dialog open={showDialog} onOpenChange={setShowDialog}>
							<DialogTrigger asChild>
								<Button className='text-2xl px-12 py-6 font-bold tracking-wide' disabled={!selectedPopcorn && !selectedDrink}>
									Send To Robots 🤖
								</Button>
							</DialogTrigger>

							<DialogContent className='sm:max-w-4xl bg-white border border-border rounded-xl shadow-xl p-8'>
								<DialogHeader>
									<DialogTitle className='text-3xl font-bold text-foreground'>Confirm Your Order</DialogTitle>
									<DialogDescription className='text-lg text-muted-foreground mt-2'>One last check before the robots roll out 🍿🦾</DialogDescription>
								</DialogHeader>

								<div className='mt-6 space-y-4 text-xl text-foreground font-medium'>
									<p>
										🍿 Popcorn: <span className='font-bold'>{popcornName}</span>
									</p>
									<p>
										🥤 Drink: <span className='font-bold'>{drinkName}</span>
									</p>
								</div>

								<DialogFooter className='mt-8 flex gap-4'>
									<Button variant='outline' onClick={() => setShowDialog(false)} className='text-lg px-8 py-4'>
										Cancel
									</Button>
									<Button onClick={confirmOrder} className='bg-primary text-primary-foreground text-2xl px-12 py-5 font-bold'>
										Confirm ✅
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
