# RAISE Web Interface

This is the front-end for RAISE, a tool for mining and analyzing software development data from GitHub and Jira. It provides a modern web interface for exploring project insights, statistics, and dashboards powered by the RAISE API.

## Requirements

- Docker
- Docker Compose

## Quick Start

### 1. Configure Environment

Create a `.env` file in the `web_src` directory with the following content:

```
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

Set `NEXT_PUBLIC_API_URL` to the URL of your running RAISE backend (see backend README for details).

### 2. Run with Docker

```bash
docker-compose up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000).

To run in the background:

```bash
docker-compose up -d --build
```

To stop the application:

```bash
docker-compose down
```

## Usage Guide

The web interface is separated into 4 main pages that the user can access.

### [/overview](#)

![Overview Page](docs/overview.png)

The overview screen is the home page. It displays a dashboard that displays data such as the number of commits, issues, pull requests, etc. You can set a date range filter and select the desired repository or project. The page also features a line chart with cumulative data.

---

### [/collect](#)

![Collect Page](docs/collect.png)

The collect page is responsible for initiating data collection on the backend of the tool. On this page, you can enter the name of the GitHub repository or Jira project, select the options for the type of data you want to mine from the repository, and also choose the date range. Once the request is made, it is redirected to the /jobs page.

---

### [/jobs](#)

![Jobs Page](docs/jobs.png)

On the /jobs page, you can monitor the tasks that are running in the background. It displays the status of each task and also provides the option to cancel any desired task.

---

### [/preview](#)

![Preview Page](docs/preview.png)

The purpose of the /preview page is to provide a way to view previously mined data. On this page, it is possible to export the data in JSON format.
