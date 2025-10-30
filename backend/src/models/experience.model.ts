import mongoose, { Schema, Document } from "mongoose";

export interface ISlot {
  date: string;
  time: string;
  capacity: number;
  booked: number;
}

export interface IExperience extends Document {
  title: string;
  description: string;
  image: string;
  location: string;
  price: number;
  slots: ISlot[];
}

const SlotSchema = new Schema<ISlot>({
  date: { type: String, required: true },
  time: { type: String, required: true },
  capacity: { type: Number, required: true },
  booked: { type: Number, default: 0 },
});

SlotSchema.virtual("available").get(function () {
  return this.booked < this.capacity;
});

const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  description: String,
  image: String,
  location: String,
  price: Number,
  slots: [SlotSchema],
});


export default mongoose.model<IExperience>("Experience", ExperienceSchema);