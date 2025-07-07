import axios from 'axios';

const api = axios.create({
	baseURL: '/api', // Maps to Next.js app/api
	withCredentials: true // ⚠️ Important to send/receive cookies (access & refresh tokens)
});

api.interceptors.response.use(
	(res) => res,
	async (err) => {
		const originalRequest = err.config;

		if (err.response?.status === 401 && !originalRequest._retry) {
			console.log('🔁 Interceptor: calling /api/auth/refresh...');
			originalRequest._retry = true;

			try {
				await axios.post('/api/auth/refresh', {}, { withCredentials: true });

				console.log('✅ Refresh successful. Retrying original request...');
				return api(originalRequest);
			} catch (refreshErr) {
				console.error('❌ Refresh failed', refreshErr);
				return Promise.reject(refreshErr);
			}
		}

		return Promise.reject(err);
	}
);

export default api;