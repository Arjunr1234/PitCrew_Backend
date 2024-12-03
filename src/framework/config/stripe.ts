import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15' as any, 
});

export async function makePayment(serviceData: any, bookId: any) {

    console.log("This is serviceData: ///////////////////////////: ", serviceData);
    console.log("This is bookingId: ", bookId);
  const line_items = serviceData.services.map((service: any) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: service.type,
      },
      unit_amount: service.startingPrice * 100,
    },
    quantity: 1,
  }));

  line_items.push({
     price_data:{
       currency:"inr",
       product_data:{
         name: "Platform fee",
       },
       unit_amount:Number(serviceData.platformFee) * 100
     },
     quantity:1
  })

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&book_id=${bookId}`,
      cancel_url: "http://localhost:5173/payment-cancelled",
    });

    return session;
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    throw error;
  }
}

export const confimPayment = async (paymentSessionId:string) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(paymentSessionId)
        return session.payment_intent
      } catch (error) {
          console.log("Error in confirmPayment: ", error);
          
      }
}

export const refundPayment = async (paymentIntent: string, refundAmount: number) => {
  try {
     
     const refund = await stripe.refunds.create({
       payment_intent: paymentIntent,
       amount: refundAmount,
     });

     
     if (refund.status === 'succeeded') {
         return { success: true, message: "Refund successful" };
     } else {
         return { success: false, message: "Refund failed" };
     }
   
  } catch (error) {
     console.log("Error in refund: ", error);
     return { success: false, message: "Error in Stripe refund" };
  }
};
