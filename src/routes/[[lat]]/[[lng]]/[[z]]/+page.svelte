<script lang="ts">
	import { replaceState } from '$app/navigation';
	import MapView from '$lib/MapView.svelte';

	let { data } = $props();

	let userLat = $state(0);
	let userLng = $state(0);
	let zoom = $state(3);

	$effect(() => {
		userLat = data.userLat;
		userLng = data.userLng;
		zoom = data.zoom;
	});

	let antipodeLat = $derived(-userLat);
	let antipodeLng = $derived(userLng > 0 ? userLng - 180 : userLng + 180);

	let urlTimer: ReturnType<typeof setTimeout> | undefined;

	function updateUrl() {
		const path = `/${userLat.toFixed(4)}/${userLng.toFixed(4)}/${zoom}`;
		replaceState(path, {userLat, userLng, zoom});
	}

	function swapLocations() {
		// const oldLat = userLat;
		// const oldLng = userLng;
		userLat = antipodeLat;
		userLng = antipodeLng;
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
		<button class="swap-button" onclick={swapLocations} title="Swap You & Antipode"></button>
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

	.swap-button {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		margin: 2px;
		width: 48px;
		height: 34px;
		background: #f0a500;
		border: none;
		border-radius: 4px;
		color: #2d5016;
		font-weight: bold;
		cursor: pointer;
		font-size: 1rem;
		transition: background 0.2s;
	}
	.swap-button::before {
		content: "⇄";
	}

	.swap-button:hover {
		background: #ffc107;
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
		.swap-button {
			position: absolute;
			left: auto;
			right: 0;
			top: 50%;
			transform: translateX(0) translateY(67%);
			padding: 13px 10px;
			writing-mode: sideways-lr;
		}
	}
</style>
