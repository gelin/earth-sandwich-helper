<script lang="ts">
	import { onMount } from 'svelte';
	import MapView from '$lib/MapView.svelte';

	let userLat = $state(0);
	let userLng = $state(0);
	let zoom = $state(3);

	let antipodeLat = $derived(-userLat);
	let antipodeLng = $derived(userLng > 0 ? userLng - 180 : userLng + 180);

	let locationLoaded = $state(false);

	onMount(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					userLat = position.coords.latitude;
					userLng = position.coords.longitude;
					zoom = 10;
					locationLoaded = true;
				},
				() => {
					locationLoaded = true;
				}
			);
		} else {
			locationLoaded = true;
		}
	});
</script>

<div class="app">
	<header>
		<h1>🥪 Earth Sandwich Helper</h1>
		<p class="coords">
			You: {userLat.toFixed(4)}°, {userLng.toFixed(4)}° |
			Antipode: {antipodeLat.toFixed(4)}°, {antipodeLng.toFixed(4)}° |
			Zoom: {zoom}
		</p>
	</header>
	<div class="maps">
		<MapView lat={userLat} lng={userLng} zoom={zoom} label="You" onmove={(uLat, uLng, z) => {
			userLat = uLat;
			userLng = uLng;
			zoom = z;
		}}/>
		<MapView lat={antipodeLat} lng={antipodeLng} zoom={zoom} label="Antipode" onmove={(aLat, aLng, z) => {
			userLat = -aLat;
			userLng = aLng > 0 ? aLng - 180 : aLng + 180;
			zoom = z;
		}} />
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	header {
		background: #2d5016;
		color: white;
		padding: 8px 16px;
		text-align: center;
	}

	header h1 {
		margin: 0;
		font-size: 1.4rem;
	}

	.coords {
		margin: 4px 0 0;
		font-size: 0.85rem;
		opacity: 0.9;
	}

	.maps {
		flex: 1;
		display: flex;
		min-height: 0;
	}

	@media (max-width: 768px) {
		.maps {
			flex-direction: column;
		}
	}
</style>
