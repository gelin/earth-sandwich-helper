# 🥪 Earth Sandwich Helper

**Earth Sandwich Helper** is a simple web application that helps you find the exact antipode of any location on Earth. Whether you are planning to make a literal "Earth Sandwich" (by placing two pieces of bread at opposite points of the globe) or just curious about what's directly beneath you, this tool provides a side-by-side map view to help you pinpoint the coordinates.

Live Demo: [https://esh.gelin.me/](https://esh.gelin.me/)

## Features

- **Side-by-Side Maps:** View your current location (or any selected point) and its antipode simultaneously.
- **Precision Crosshairs:** Centered crosshairs on both maps for exact positioning.
- **Location Swapping:** Quickly swap between your location and the antipode to see the world from the other side.
- **Responsive Design:** Works on both desktop and mobile devices.
- **URL Synchronization:** Coordinates and zoom levels are kept in the URL for easy sharing.

## Tech Stack

- [Svelte 5](https://svelte.dev/)
- [Leaflet](https://leafletjs.com/) for mapping
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22 or later recommended)
- npm (or pnpm/yarn)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/gelin/earth-sandwich-helper.git
   cd earth-sandwich-helper
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Developing

Start the development server with:

```sh
npm run dev
```

### Building

To create a production version of the app:

```sh
npm run build
```

The output will be in the `build/` directory.

### Linting and Type Checking

To check the code for errors:

```sh
npm run check
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
