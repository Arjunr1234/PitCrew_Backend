"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPayment = exports.confimPayment = void 0;
exports.makePayment = makePayment;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("../app");
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
function makePayment(serviceData, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        const line_items = serviceData.services.map((service) => ({
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
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Platform fee",
                },
                unit_amount: Number(serviceData.platformFee) * 100
            },
            quantity: 1
        });
        try {
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: line_items,
                mode: "payment",
                success_url: `${app_1.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&book_id=${bookId}`,
                cancel_url: `${app_1.origin}/payment-cancelled`,
            });
            return session;
        }
        catch (error) {
            console.error("Error creating Stripe session:", error);
            throw error;
        }
    });
}
const confimPayment = (paymentSessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.checkout.sessions.retrieve(paymentSessionId);
        return session.payment_intent;
    }
    catch (error) {
        console.log("Error in confirmPayment: ", error);
    }
});
exports.confimPayment = confimPayment;
const refundPayment = (paymentIntent, refundAmount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refund = yield stripe.refunds.create({
            payment_intent: paymentIntent,
            amount: refundAmount,
        });
        if (refund.status === 'succeeded') {
            return { success: true, message: "Refund successful" };
        }
        else {
            return { success: false, message: "Refund failed" };
        }
    }
    catch (error) {
        console.log("Error in refund: ", error);
        return { success: false, message: "Error in Stripe refund" };
    }
});
exports.refundPayment = refundPayment;
