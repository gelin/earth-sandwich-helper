<script lang="ts">
	import { replaceState } from '$app/navigation';
	import MapView from '$lib/MapView.svelte';

	let { data } = $props();

	let userLat = $derived(data.userLat);
	let userLng = $derived(data.userLng);
	let zoom = $derived(data.zoom);

	let antipodeLat = $derived(-userLat);
	let antipodeLng = $derived(userLng > 0 ? userLng - 180 : userLng + 180);

	let urlTimer: ReturnType<typeof setTimeout> | undefined;

	function updateUrl() {
		const path = `/${userLat.toFixed(4)}/${userLng.toFixed(4)}/${zoom}`;
		replaceState(path, {userLat, userLng, zoom});
	}

	$effect(() => {
		// Access reactive values to track them
		const _lat = userLat;
		const _lng = userLng;
		const _z = zoom;
		clearTimeout(urlTimer);
		urlTimer = setTimeout(updateUrl, 300);
	});
</script>

<div class="app">
	<header>
		<h1>🥪 Earth Sandwich Helper</h1>
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
