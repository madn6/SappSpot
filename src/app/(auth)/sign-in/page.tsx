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
import nonveg from '../../assests/images/naan.jpg';

// Define the form data type
type SignInFormData = {
	email: string;
	password: string;
};

//Form Schema
const signInSchema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().min(8).required()
});

export default function SignInPage() {
	const [showPassword, setShowPassword] = useState(false);

	const togglePassword = () => setShowPassword((prev) => !prev);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting }
	} = useForm<SignInFormData>({
		resolver: yupResolver(signInSchema)
	});

	const watchPassword = watch('password');

	const onSubmit = async (data: SignInFormData) => {
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

				<div className=" absolute z-30 rounded-lg p-6 max-w-md w-full space-y-6">
					<h2 className="text-center text-2xl font-bold">
						Sign In to{' '}
						<span className="font-serif text-sapp-primary font-light italic">Sapp Spot</span>
					</h2>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<p className="mb-1">Email</p>
							<input
								type="email"
								placeholder="Email"
								{...register('email')}
								className="w-full px-4 py-3 rounded-lg border border-sapp-border bg-sapp-surface text-white placeholder:text-sapp-muted-text focus:outline-none"
							/>
							{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
						</div>

						<div className="">
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

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full flex  items-center justify-center gap-2 cursor-pointer py-3 rounded-lg bg-sapp-primary hover:bg-sapp-primary-hover text-sapp-background font-semibold transition disabled:opacity-60"
						>
							<LogIn size={20} /> {isSubmitting ? 'Loading...' : 'Sign In'}
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
						New to Sapp Spot?
						<Link href="/sign-up" className="ml-1 text-sapp-primary hover:underline">
							Create an account
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
