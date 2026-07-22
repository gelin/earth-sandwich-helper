<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Map as LeafletMap } from 'leaflet';

	let {
		lat = 0,
		lng = 0,
		zoom = 3,
		label = '',
		onmove
	}: {
		lat: number;
		lng: number;
		zoom: number;
		label: string;
		onmove?: (lat: number, lng: number, zoom: number) => void;
	} = $props();

	let mapContainer: HTMLDivElement;
	let map: LeafletMap | undefined = $state(undefined);
	let skipEvents = 0;

	function emitPosition() {
		if (!map || skipEvents > 0) return;
		const center = map.getCenter();
		const z = map.getZoom();
		if (onmove) {
			onmove(center.lat, center.lng, z);
		} else {
			lat = center.lat;
			lng = center.lng;
			zoom = z;
		}
	}

	onMount(async () => {
		const L = await import('leaflet');

		map = L.map(mapContainer).setView([lat, lng], zoom);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		map.on('move', emitPosition);
		map.on('zoomend', emitPosition);
	});

	$effect(() => {
		if (map) {
			const _lat = lat;
			const _lng = lng;
			const _zoom = zoom;
			const currentCenter = map.getCenter();
			const currentZoom = map.getZoom();
			if (
				Math.abs(currentCenter.lat - _lat) > 0.0001 ||
				Math.abs(currentCenter.lng - _lng) > 0.0001 ||
				currentZoom !== _zoom
			) {
				skipEvents++;
				// console.log('setting view', label, _lat, _lng, _zoom);
				map.setView([_lat, _lng], _zoom, { animate: false });
				skipEvents--;
			}
		}
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div class="map-wrapper">
	<div class="map-label">{label}: {lat.toFixed(4)}°, {lng.toFixed(4)}°</div>
	<div class="map-area">
		<div class="map-container" bind:this={mapContainer}></div>
		<div class="crosshair">
			<svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="red" stroke-width="2">
				<line x1="40" y1="0" x2="40" y2="800" />
				<line x1="0" y1="40" x2="80" y2="40" />
			</svg>
		</div>
	</div>
</div>

<style>
	.map-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.map-area {
		flex: 1;
		display: flex;
		min-height: 0;
		position: relative;
	}

	.map-label {
		padding: 8px 16px;
		background: #333;
		color: white;
		font-weight: bold;
		font-size: 1rem;
		text-align: center;
	}

	.map-container {
		flex: 1;
		min-height: 0;
	}

	.crosshair {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 1000;
	}
</style>
