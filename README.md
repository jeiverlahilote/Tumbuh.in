
<p align="center">
  <img src="./public/Tumbuh.in_Poster.png" alt="TUMBUH.in Banner" style="max-width: 100%; border-radius: 12px;" />
</p>

<h1 align="center">
  TUMBUH.in – Community-Powered Crop Forecasting Platform
</h1>

<p align="center">
  <strong>A smart and collaborative platform for Indonesian farmers to optimize agricultural decisions.</strong><br/>
  Leveraging community data and AI-powered insights to predict the best crops to plant based on land, season, and trends.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white" />
  <img src="https://img.shields.io/badge/DeepSeek-0091FF?logo=openai&logoColor=white" />
  <img src="https://img.shields.io/github/actions/workflow/status/your-username/tumbuhin/ci.yml?branch=main&label=CI&logo=github&style=flat" />
</p>

<p align="center">
  <a href="https://tumbuhin.netlify.app/">🌐 View Live Deployment</a>
</p>

---

## Overview

TUMBUH.in is a data-driven web application designed to assist farmers in making better planting decisions. Built with modern web technologies and powered by community-driven data, the platform provides intelligent crop recommendations, early warning systems, and agricultural trend analytics tailored for local environments.

---

## Key Features

- **Farmer Input Module**  
  Simple and intuitive form for reporting land conditions, current crops, pests, and local weather.

- **Community Statistics Dashboard**  
  Aggregated visualizations of planted commodities, pest outbreaks, yield trends, and active farming areas.

- **AI Crop Recommendation Engine**  
  Suggests the best crops to plant this season based on collective data, land type, and seasonal insights.

- **Agricultural Risk Alerts**  
  Community-sourced warnings related to pest attacks, extreme weather, or potential threats in specific regions.

- **Contributor Leaderboard**  
  Highlights top contributors, active districts, and gamified achievements to encourage participation.

---

## Technology Stack

| Layer           | Technology                                                                 |
|----------------|-----------------------------------------------------------------------------|
| Frontend        | ![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs) + ![React](https://img.shields.io/badge/React-20232A?logo=react) + ![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss) |
| Backend         | ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs) + ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase) |
| Database        | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql) (Geo support) |
| Authentication  | Supabase Auth (Email/Phone OTP)                                            |
| Hosting         | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify)       |
| Geolocation     | Leaflet.js + OpenStreetMap API                                             |
| AI Model        | ![DeepSeek](https://img.shields.io/badge/DeepSeek-via%20OpenRouter-0091FF?logo=openai) |

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/jeiverlahilote/Tumbuh.in  
cd tumbuhin
```

2. Install dependencies:

```bash
npm install
```

3. Create environment config:

```bash
touch .env.local
```

`.env.local` content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the app.

---

## Contribution

We welcome contributions from developers, designers, and agricultural researchers. You can:

- Fork this repository and create a feature branch
- Submit a pull request with detailed description
- Report issues or suggest improvements in the Issues tab

Help us improve data-driven agriculture for everyone.

---

## License

This project is licensed under the owner License.  
Produced by Jeiver Junior Lahilote.
