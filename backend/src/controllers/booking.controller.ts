import { Request, Response } from "express";
import mongoose from "mongoose";
import Booking from "../models/booking.model";
import Experience from "../models/experience.model";
import promoCodes from "../utils/promoCodes";

function convertTo24Hour(time12h: string) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


export const createBooking = async (req: Request, res: Response) => {
  try {
    const { name, orderId, email, experienceId, quantity, slot, promoCode } = req.body;

    if (!name || !orderId || !email || !experienceId || !quantity || !slot) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!slot.date || !slot.time) {
      return res.status(400).json({ error: "Slot must include both date and time" });
    }

    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      return res.status(400).json({ error: "Invalid experience ID format" });
    }

    const time24 = convertTo24Hour(slot.time);
    const slotDateTime = new Date(`${slot.date}T${time24}`);
    const now = new Date();
    if (isNaN(slotDateTime.getTime())) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }
    if (slotDateTime < now) {
      return res.status(400).json({ error: "Slot time must be in the future" });
    }

    const experience = await Experience.findById(experienceId);
    if (!experience) return res.status(404).json({ error: "Experience not found" });

    const matchedSlot = experience.slots.find(
      (expSlot: any) => expSlot.date === slot.date && expSlot.time === slot.time
    );

    if (!matchedSlot) {
      return res.status(400).json({ error: "Selected slot not found for this experience" });
    }

    if (matchedSlot.booked >= matchedSlot.capacity) {
      return res.status(400).json({ error: "This slot is fully booked" });
    }

    if ((matchedSlot.booked + quantity) > matchedSlot.capacity) {
      return res.status(400).json({ error: `${quantity} slots are not available` });
    }

    const discount = promoCodes[promoCode] || 0;
    const totalPrice = Math.max(0, experience.price * quantity - discount);

    const booking = new Booking({
      name,
      orderId,
      email,
      experienceId,
      slot,
      quantity,
      totalPrice,
      promoCode,
    });
    // updating booking to Booking database
    await booking.save();
    // updating number of booked slot to Experiences database
    await Experience.updateOne(
      {
        _id: experienceId,
        "slots.date": slot.date,
        "slots.time": slot.time,
      },
      {
        $inc: { "slots.$.booked": quantity },
      }
    );

    res.status(201).json({ success: true, booking });
  } 
  catch (err) {
    console.error("Booking Creation Error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const validatePromo = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Promo code is required" });
    }

    const discount = promoCodes[code];
    if (discount) return res.json({ valid: true, discount });

    res.json({ valid: false });
  } 
  catch (err) {
    console.error("Promo Validation Error:", err);
    return res.status(500).json({ error: (err as Error).message });
  }
};
