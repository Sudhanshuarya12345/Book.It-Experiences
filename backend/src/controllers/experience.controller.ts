import { Request, Response } from "express";
import mongoose from "mongoose";
import Experience from "../models/experience.model";


export const getAllExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find();

    if (!experiences || experiences.length === 0) {
      return res.status(404).json({ error: "No experiences found" });
    }

    return res.json(experiences);
  } 
  catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};



export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid experience ID format" });
    }

    const experience = await Experience.findById(id);
    if (!experience) return res.status(404).json({ error: "Experience not found" });

    return res.json(experience);
  } 
  catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};
