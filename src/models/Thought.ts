import { Schema, model, type Document, Types } from 'mongoose';

interface IThought extends Document {
    thoughtText: string,
    createdAt: Date,
    username: string,
    reactions: IReaction[],
    reactionCount?: number
}

interface IReaction extends Document {
    reactionId: Types.ObjectId,
    reactionBody: string,
    username: string,
    createdAt: Date
}

const reactionSchema = new Schema<IReaction>(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength:280
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            getter: (timestamp: Date) => timestamp.toLocaleString()     
        }
    },
    {
        toJSON: {
            getters: true
        },
        _id: false,
        timestamps: true
    }
);

const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength:280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            getter: (timestamp: Date) => timestamp.toLocaleString()
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters:true
        },
        _id: true,
        timestamps: true
    }
);

thoughtSchema.virtual("reactionCount").get(function(this:IThought){
    return this.reactions.length;
});

const Thought = model<IThought>('thought', thoughtSchema);

export default Thought;
