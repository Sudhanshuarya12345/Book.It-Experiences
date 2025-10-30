import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  orderId: string;
  name: string;
  email: string;
  experienceId: mongoose.Types.ObjectId;
  slot: {
    date: string;
    time: string;
  };
  quantity: number;
  totalPrice: number;
  promoCode?: string;
  status: "confirmed" | "failed";
}

const BookingSchema = new Schema<IBooking>({
  orderId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  experienceId: { type: Schema.Types.ObjectId, ref: "Experience" },
  slot: {
    date: String,
    time: String,
  },
  quantity: Number,
  totalPrice: Number,
  promoCode: String,
  status: { type: String, enum: ["confirmed", "failed"], default: "confirmed" },
});

export default mongoose.model<IBooking>("Booking", BookingSchema);