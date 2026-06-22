import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
	const pLat = params.lat ? parseFloat(params.lat) : NaN;
	const pLng = params.lng ? parseFloat(params.lng) : NaN;
	const pZ = params.z ? parseInt(params.z, 10) : NaN;

	if (!isNaN(pLat) && !isNaN(pLng)) {
		return {
			userLat: pLat,
			userLng: pLng,
			zoom: !isNaN(pZ) ? pZ : 10,
			fromUrl: true
		};
	}

	// Geolocation must run in browser
	if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
		const position = await new Promise<GeolocationPosition | null>((resolve) => {
			navigator.geolocation.getCurrentPosition(
				(pos) => resolve(pos),
				() => resolve(null)
			);
		});

		if (position) {
			return {
				userLat: position.coords.latitude,
				userLng: position.coords.longitude,
				zoom: 10,
				fromUrl: false
			};
		}
	}

	return {
		userLat: 0,
		userLng: 0,
		zoom: 3,
		fromUrl: false
	};
};
