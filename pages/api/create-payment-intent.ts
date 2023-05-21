import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { AddCartType } from "@/types/AddCartType";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
})

const prisma = new PrismaClient()

const calculateOrderAmount = (items: AddCartType[]) => {
    const total = items.reduce((acc, item) => {
        return acc + item.unit_amount! * item.quantity!
    }, 0)
    return total
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userSession = await getServerSession(req, res, authOptions)
    if(!userSession) {
        res.status(403).json({error: "Not logged in"})
        return
    }
    const {items, payment_intent_id} = req.body

    const orderData = {
        user: {connect: {id: userSession.user?.id}},
        amount: calculateOrderAmount(items),
        currency: "usd",
        status: "pending",
        paymentIntentId: payment_intent_id,
        products: {
            create: items.map((item) => ({
                name: item.name,
                description: item.description,
                unit_amount: parseFloat(item.unit_amount) ,
                image: item.image,
                quantity: item.quantity,
            }))
        }
    }

    if(payment_intent_id){
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id)
        if(current_intent){
            const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {
                amount: calculateOrderAmount(items)
            })

            const existingOrder = await prisma.order.findFirst({
                where: {
                    paymentIntentId: payment_intent_id
                },
                include: {
                    products: true
                }
            })
            
            if(!existingOrder){
                res.status(400).json({message: "Order not found"})
        
            }

            const updatedOrder = await prisma.order.update({
                where: {
                    id: existingOrder?.id
                },
                data: {
                    amount: calculateOrderAmount(items),
                    products: {
                        deleteMany: {},
                        create: items.map((item) => ({
                            name: item.name,
                            description: item.description || null,
                            unit_amount: parseFloat(item.unit_amount) ,
                            image: item.image,
                            quantity: item.quantity,
                        }))

                    }
                }
            })
        
            res.status(200).json({paymentIntent: updated_intent})
            return


        }


    }else{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "usd",
            automatic_payment_methods: { enabled: true}
        })
        orderData.paymentIntentId = paymentIntent.id

        const newOrder = await prisma.order.create({
            data: orderData
        })
        res.status(200).json({paymentIntent})
    }

    

}