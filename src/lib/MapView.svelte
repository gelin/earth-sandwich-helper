<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Map as LeafletMap } from 'leaflet';

	let {
		lat = $bindable(0),
		lng = $bindable(0),
		zoom = $bindable(3),
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
	let map: LeafletMap | undefined;
	let updatingFromProps = false;
	let userInteracting = false;

	onMount(async () => {
		const L = await import('leaflet');

		map = L.map(mapContainer).setView([lat, lng], zoom);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		map.on('movestart', () => {
			if (!updatingFromProps) {
				userInteracting = true;
			}
		});

		map.on('moveend', () => {
			if (userInteracting) {
				const center = map!.getCenter();
				const z = map!.getZoom();
				if (onmove) {
					onmove(center.lat, center.lng, z);
				} else {
					lat = center.lat;
					lng = center.lng;
					zoom = z;
				}
				userInteracting = false;
			}
		});
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
				updatingFromProps = true;
				map.setView([_lat, _lng], _zoom, { animate: false });
				updatingFromProps = false;
			}
		}
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div class="map-wrapper">
	<div class="map-label">{label}</div>
	<div class="map-container" bind:this={mapContainer}></div>
</div>

<style>
	.map-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
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
</style>
