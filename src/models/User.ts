import { Schema, model, type Document } from 'mongoose';

interface IUser extends Document {
    username: string,
    email: string,
    thoughts: Schema.Types.ObjectId[],
    friends: Schema.Types.ObjectId[],
    friendCount?: number
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must match a valid email address']
    },
    thoughts:[
        {
        type: Schema.Types.ObjectId,
        ref: "thought"
        }
    ],
    friends: [
        {
        type: Schema.Types.ObjectId,
        ref: "user"
        }
    ]
},
    {
        toJSON: {
            getters: true,
        },
    }
);

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
  });


const User = model<IUser>('user', userSchema);

export default User;
