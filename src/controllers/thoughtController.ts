import { Request, Response } from 'express';
import { Thought, User } from '../models/index.js';

/**
 * GET All Thoughts /thoughts
 * @returns an array of thoughts
*/
export const getAllThoughts = async(_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch(error: any){
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET Thought based on id /thought/:id
 * @param string id
 * @returns a single Thought object
*/
export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
      const user = await Thought.findById(thoughtId);
      if(user) {
        res.json(user);
      } else {
        res.status(404).json({
          message: 'Thought not found'
        });
      }
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

  /**
 * POST thought /Thoughts
 * @param object username
 * @returns a single thought object
*/
export const createThought = async (req: Request, res: Response) => {
    try {
        const newThought = await Thought.create(req.body);

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: newThought._id } },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found to associate the thought." });
        }

        return res.status(201).json({ message: "Thought successfully created and linked to user!" });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

/**
 * PUT Thought based on id /Thoughts/:id
 * @param object id, username
 * @returns a single thought object
*/
export const updateThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought)
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };

  /**
 * DELETE thought based on id /Thoughts/:id
 * @param string id
 * @returns string 
*/
export const deleteThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId});
      
      if(!thought) {
        res.status(404).json({
          message: 'No thoughts with that ID'
        });
      } else {
        await User.deleteMany({ _id: { $in: thought } });
        res.json({ message: 'thoughts and users deleted!' });
      }
      
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };
/**
 * Post reaction based on id /Thoughts/:id
 * @param string id
 * @returns string 
*/
export const createReaction = async (req: Request, res: Response) => {
  try {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    // Validate required fields
    if (!reactionBody || !username) {
      return res.status(400).json({ message: 'Reaction body and username are required' });
    }

    // Find the thought and add the reaction
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $push: { reactions: { reactionBody, username } }, // Add the reaction
        // $addToSet
      },
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    return res.status(201).json(updatedThought);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding reaction', error });
  }
};
/**
 * DELETE reaction based on id /Thoughts/:id
 * @param string id
 * @returns string 
*/
export const deleteReaction = async (req: Request, res: Response) => {
  try {
    const { thoughtId, reactionId } = req.params;

    // Find the thought and remove the reaction by its ID
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $pull: { reactions: { reactionId } }, // Remove the reaction with the matching reactionId
      },
      { new: true } // Return the updated document
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    return res.json(updatedThought);
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting reaction', error });
  }
};
