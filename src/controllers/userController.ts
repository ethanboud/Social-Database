import { Request, Response } from 'express';
import { User } from '../models/index.js';

/**
 * GET All Users /users
 * @returns an array of users
*/
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find().populate('thoughts');

        res.json(users);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET User based on id /users/:id
 * @param string id
 * @returns a single User object
*/
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('thoughts');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * POST User /users
 * @param object user
 * @returns a single User object
*/

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}
/**
 * PUT User based on id /users/:id
 * @param string id
 * @returns string 
*/
export const updateUser = async (req:Request, res: Response) => {
    try{
        const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
              );
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}
/**
 * DELETE User based on id /users/:id
 * @param string id
 * @returns string 
*/

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No such user exists' });
        }

        return res.json({ message: 'User successfully deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

/**
 * POST Friend based on /users/:userId/friends
 * @param string id
 * @param object assignment
 * @returns object student 
*/

export const addFriend = async (req: Request, res: Response) => {
    console.log('You are adding a new friend');
    console.log(req.body);
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body } },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res
                .status(404)
                .json({ message: 'No user found with that ID :( no friend for you.' });
        }

        return res.json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
}

/**
 * DELETE Friend based on /users/:userId/friends
 * @param string friendId
 * @param string userId
 * @returns object user 
*/

export const removeFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } }, // Directly pull the friendId
            { runValidators: true, new: true }
        );

        if (!user) {
            return res
                .status(404)
                .json({ message: 'No user found with that ID :(' });
        }

        return res.json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
};
