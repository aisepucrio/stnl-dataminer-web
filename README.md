# RAISE Web Interface

This is the front-end for RAISE, a tool for mining and analyzing software development data from GitHub and Jira. It provides a modern web interface for exploring project insights, statistics, and dashboards powered by the RAISE API.

## Requirements

- Node.js (tested with version 22.17)

## Quick Start

### 1. Configure Environment

Create a `.env` file in the `web_src` directory with the following content:

```
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

Set `NEXT_PUBLIC_API_URL` to the URL of your running RAISE backend (see backend README for details).

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.