import { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
	displayName: string;
	username: string;
	email: string;
	password: string;
	profileImage?: string;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
	{
		displayName: {
			type: String,
			required: true,
			trim: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		profileImage: {
			type: String,
			default: '',
		},
	},
	{ timestamps: true }
);

const User = models.User || model<IUser>('User', UserSchema);
export default User;
