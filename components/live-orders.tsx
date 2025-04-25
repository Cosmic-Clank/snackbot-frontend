"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import config from "./config.json";

interface OrderItem {
	item_name: string;
	quantity: number;
}

interface Order {
	order_id: string;
	status: string;
	data: {
		items: OrderItem[];
	};
}

export default function LiveOrders() {
	const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
	const [queuedOrders, setQueuedOrders] = useState<Order[]>([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await fetch(`${config.backend_url}/orders`);
				const data = await res.json();
				setCurrentOrder(data.current_order || null);
				setQueuedOrders(data.queued_orders || []);
			} catch (err) {
				console.error("Error fetching orders:", err);
			}
		};

		fetchOrders();
		const interval = setInterval(fetchOrders, 2000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Card className='h-full overflow-y-auto border-none shadow-lg bg-white'>
			<CardContent className='p-6 flex flex-col gap-6'>
				<h2 className='text-xl font-bold text-orange-600'>🦾 Currently Serving Orders</h2>

				<AnimatePresence>
					{currentOrder ? (
						<motion.div key={currentOrder.order_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }} className='border border-orange-300 bg-orange-50 rounded-lg p-6 shadow-md flex flex-col gap-4'>
							<div className='flex justify-between items-center'>
								<div>
									<span className='text-lg font-bold text-orange-800'>🍳 Prepping Now #{currentOrder.order_id.slice(0, 6)}</span>
								</div>
								<div className='w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
							</div>

							<ul className='pl-5 list-disc space-y-2 text-gray-800 mt-4'>
								{currentOrder.data?.items?.map((item, i) => (
									<li key={i} className='text-base'>
										{item.item_name} × {item.quantity}
									</li>
								))}
							</ul>
						</motion.div>
					) : (
						<motion.div key='none-current' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='text-sm text-gray-500 text-center'>
							No active order being prepared 🍽️
						</motion.div>
					)}

					{queuedOrders.length > 0 && (
						<div className='mt-8'>
							<h3 className='text-lg font-semibold text-gray-700 mb-4'>🧾 Queued Orders</h3>

							{queuedOrders.map((order, index) => (
								<motion.div key={order.order_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3, delay: index * 0.05 }} className='border border-gray-200 bg-white rounded-lg p-4 shadow-sm mb-4'>
									<div className='flex justify-between items-center mb-2'>
										<span className='font-semibold text-gray-800'>Order #{order.order_id.slice(0, 6)}</span>
										<span className={`text-sm font-medium px-3 py-1 rounded-full ${order.status === "queued" ? "bg-gray-200 text-gray-800" : order.status === "in_progress" ? "bg-yellow-200 text-yellow-900" : "bg-green-200 text-green-900"}`}>{order.status.replace("_", " ")}</span>
									</div>

									<ul className='pl-4 list-disc space-y-1 text-sm text-gray-700'>
										{order.data?.items?.map((item, i) => (
											<li key={i}>
												{item.item_name} × {item.quantity}
											</li>
										))}
									</ul>
								</motion.div>
							))}
						</div>
					)}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}
