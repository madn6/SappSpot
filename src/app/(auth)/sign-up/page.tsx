'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import veg from '../../assests/images/dosa.jpg';
// import nonveg from '../../assests/images/naan.jpg';

// Define the form data type
type SignUpFormData = {
	displayName: string;
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

// Form validation schema
const signupSchema = yup.object().shape({
	displayName: yup
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(50, 'Name is too long')
		.required('Name is required'),

	username: yup
		.string()
		.min(3, 'At least 3 characters')
		.max(20, 'Max 20 characters')
		.matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
		.required('Username is required'),

	email: yup.string().email('Invalid email').required('Email is required'),

	password: yup
		.string()
		.min(8, 'At least 8 characters')
		.matches(/[a-zA-Z]/, 'Must include a letter')
		.matches(/[0-9]/, 'Must include a number')
		.required('Password is required'),

	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Passwords must match')
		.required('Confirm Password is required')
});

export default function SignUpPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const togglePassword = () => setShowPassword((prev) => !prev);

	const toggleConfirmPassword = () => {
		setShowConfirmPassword((prev) => !prev);
	};

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting }
	} = useForm<SignUpFormData>({
		resolver: yupResolver(signupSchema)
	});

	const watchPassword = watch('password');
	const watchConfirmPassword = watch('confirmPassword');

	const onSubmit = async (data: SignUpFormData) => {
		console.log('Sign In Submitted:', data);
		// TODO: API integration here
	};

	return (
		<div className="min-h-screen w-full flex flex-col lg:flex-row">
			<div className="hidden lg:flex flex-col justify-center items-center w-1/2 text-sapp-white">
				<div className="relative w-full h-full">
					<Image src={veg} alt="Food" className="w-full h-full object-cover" fill />
					<div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-center px-4">
						<h2 className="text-5xl font-sans  text-sapp-primary font-light mb-2 font-rangile">
							Taste the South, One Dish at a Time
						</h2>
						<p className="text-xl italic font-sans text-sapp-white">
							Join Sapp Spot Share your favorite idlis, dosas, biryanis & beyond!
						</p>
					</div>
				</div>
			</div>

			<div className="flex relative flex-1 items-center justify-center ">
				{/* <Image
					src={nonveg}
					alt="Food"
					className="w-full md:border-l-2 border-yellow-300 h-full object-cover"
					fill
				/>
				<div className="absolute inset-0 bg-black/80 z-10"></div> */}

				<div className="min-h-screen flex items-center justify-center bg-sapp-background px-4 py-10">
					<div className=" absolute z-30  rounded-lg p-6 max-w-md w-full space-y-6">
						<h2 className="text-center text-2xl font-bold">
							Sign Up to{' '}
							<span className="font-serif text-sapp-primary font-light italic">Sapp Spot</span>
						</h2>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="mb-1">Display Name</p>
									<input
										type="text"
										placeholder="ex: John Doe"
										{...register('displayName')}
										className="w-full px-4 py-3 rounded-lg border border-sapp-border bg-sapp-surface text-white placeholder:text-sapp-muted-text focus:outline-none"
									/>
									{errors.displayName && (
										<p className="text-red-500 text-sm mt-1">{errors.displayName.message}</p>
									)}
								</div>

								<div>
									<p className="mb-1">Username</p>
									<input
										type="text"
										placeholder="ex: @Username1234"
										{...register('username')}
										className="w-full px-4 py-3 rounded-lg border border-sapp-border bg-sapp-surface text-white placeholder:text-sapp-muted-text focus:outline-none"
									/>
									{errors.username && (
										<p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
									)}
								</div>
							</div>

							<div>
								<p className="mb-1">Email</p>
								<input
									type="email"
									placeholder="Email"
									{...register('email')}
									className="w-full px-4 py-3 rounded-lg border border-sapp-border bg-sapp-surface text-white placeholder:text-sapp-muted-text focus:outline-none"
								/>
								{errors.email && (
									<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
								)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="mb-1">Password</p>
									<div className="relative">
										<input
											type={showPassword ? 'text' : 'password'}
											placeholder="Password"
											{...register('password')}
											className="w-full px-4 py-3 rounded-lg border border-sapp-border bg-sapp-surface text-white placeholder:text-sapp-muted-text focus:outline-none"
										/>
										{watchPassword && (
											<button
												type="button"
												onClick={togglePassword}
												className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sapp-muted-text"
												aria-label="Toggle password visibility"
											>
												{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
											</button>
										)}
										{errors.password && (
											<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
										)}
									</div>
								</div>

								<div>
									<p className="mb-1">Confirm Password</p>
									<div className="relative">
										<input
											type={showConfirmPassword ? 'text' : 'password'}
											placeholder="Password"
											{...register('confirmPassword')}
											className="w-full px-4 py-3 rounded-lg border border-sapp-border bg-sapp-surface text-white placeholder:text-sapp-muted-text focus:outline-none"
										/>
										{watchConfirmPassword && (
											<button
												type="button"
												onClick={toggleConfirmPassword}
												className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sapp-muted-text"
												aria-label="Toggle password visibility"
											>
												{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
											</button>
										)}
										{errors.confirmPassword && (
											<p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
										)}
									</div>
								</div>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex items-center justify-center gap-2 cursor-pointer py-3 rounded-lg bg-sapp-primary hover:bg-sapp-primary-hover text-sapp-background font-semibold transition disabled:opacity-60"
							>
								<LogIn size={20} /> {isSubmitting ? 'Loading...' : 'Sign Up'}
							</button>
						</form>

						<div className="flex items-center gap-4 my-6">
							<hr className="flex-grow border-sapp-border" />
							<p className="text-sapp-muted-text text-sm whitespace-nowrap">or continue with</p>
							<hr className="flex-grow border-sapp-border" />
						</div>

						<button className="w-full flex items-center justify-center gap-2 cursor-pointer py-3 rounded-lg bg-sapp-primary hover:bg-sapp-primary-hover text-sapp-background font-semibold transition disabled:opacity-60">
							<FaGoogle size={20} /> Sign in with Google
						</button>

						<p className="text-center text-sm">
							Already have an account?
							<Link href="/sign-in" className="ml-1 text-sapp-primary hover:underline">
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
