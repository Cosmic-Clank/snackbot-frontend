"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
	item_name: string;
	quantity: number;
}

interface Order {
	order_id: string;
	status: string;
	items?: OrderItem[]; // ⬅️ marked optional
}

export default function LiveOrders() {
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await fetch("http://192.168.1.126:8000/orders");
				const data = await res.json();
				setOrders(data.orders || []);
			} catch (err) {
				console.error("Error fetching orders:", err);
			}
		};

		fetchOrders(); // initial
		const interval = setInterval(fetchOrders, 2000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Card className='h-full overflow-y-auto border-none shadow-lg bg-white'>
			<CardContent className='p-6 flex flex-col gap-6'>
				<h2 className='text-xl font-bold text-orange-600'>🦾 Currently Serving Orders</h2>

				<AnimatePresence>
					{orders.length > 0 ? (
						orders.map((order, index) => (
							<motion.div key={order.order_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, delay: index * 0.05 }} className='border border-gray-200 bg-white rounded-lg p-4 shadow-sm'>
								<div className='flex justify-between items-center mb-2'>
									<span className='font-semibold text-gray-800'>Order #{order.order_id.slice(0, 6)}</span>
									<span className={`text-sm font-medium px-3 py-1 rounded-full ${order.status === "queued" ? "bg-gray-200 text-gray-800" : order.status === "in_progress" ? "bg-yellow-200 text-yellow-900" : "bg-green-200 text-green-900"}`}>{order.status.replace("_", " ")}</span>
								</div>
								<ul className='pl-4 list-disc space-y-1 text-sm text-gray-700'>
									{Array.isArray(order.items) &&
										order.items.map((item, i) => (
											<li key={i}>
												{item.item_name} × {item.quantity}
											</li>
										))}
								</ul>
							</motion.div>
						))
					) : (
						<motion.div key='none' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='text-sm text-gray-500 text-center'>
							No active orders at the moment 🍽️
						</motion.div>
					)}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}
