import User from '@/models/Auth.model';
import bcrypt from 'bcryptjs';
import { generateTokens } from '@/lib/generateTokens';
import jwt from 'jsonwebtoken';

export const registerUser = async (body: {
	displayName: string;
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}) => {
	const { displayName, username, email, password, confirmPassword } = body;

	// validate
	if (password !== confirmPassword) {
		return { error: 'Passwords do not match', status: 400 };
	}

	// check email or username already taken
	const existingEmail = await User.findOne({ email });
	if (existingEmail) return { error: 'Email already exists', status: 400 };

	const existingUsername = await User.findOne({ username });
	if (existingUsername) return { error: 'Username already exists', status: 400 };

	// hash password and create
	const hashed = await bcrypt.hash(password, 10);
	const newUser = await User.create({ displayName, username, email, password: hashed });

	const { accessToken, refreshToken } = generateTokens(newUser._id.toString());

	return {
		user: {
			id: newUser._id,
			displayName: newUser.displayName,
			username: newUser.username,
			email: newUser.email,
			profileImage: newUser.profileImage
		},
		accessToken,
		refreshToken
	};
};

export const loginUser = async (body: { email: string; password: string }) => {
	const { email, password } = body;

	const user = await User.findOne({ email });

	if (!user) {
		return { error: 'User not found', status: 400 };
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return { error: 'Invalid credentials', status: 401 };
	}

	const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
		expiresIn: '15m'
	});

	const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET!, {
		expiresIn: '7d'
	});

	return {
		user: {
			id: user._id,
			username: user.username,
			email: user.email,
			displayName: user.displayName,
			profileImage: user.profileImage
		},
		accessToken,
		refreshToken
	};
};
