import axios from 'axios';

const api = axios.create({
	baseURL: '/api', // Maps to Next.js app/api
	withCredentials: true // ⚠️ Important to send/receive cookies (access & refresh tokens)
});

// Interceptor for 401 error
api.interceptors.response.use(
	(res) => res,
	async (err) => {
		const originalRequest = err.config;

		if (err.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				await axios.post('/api/auth/refresh', {}, { withCredentials: true });
				return api(originalRequest); // retry the original request
			} catch (refreshErr) {
				console.error('Refresh token failed');
				return Promise.reject(refreshErr);
			}
		}

		return Promise.reject(err);
	}
);

export default api;
