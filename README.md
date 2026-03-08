# AI Fitness Coach 💪

AI-powered fitness training and diet management web application.

![License](https://img.shields.io/github/license/icmdw/ai-fitness-coach)
![Status](https://img.shields.io/badge/status-in%20development-yellow)

## Features

- 📝 **Training Log** - Track your workouts, sets, reps, and weights
- 📊 **Body Metrics** - Record weight, body fat, measurements
- 📈 **Data Visualization** - Beautiful charts showing your progress
- 🤖 **AI Coach** - Get personalized training suggestions and analysis

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + TailwindCSS + ECharts |
| Backend | Node.js (Express) / Python (FastAPI) |
| Database | SQLite / PostgreSQL |
| AI | Higress Gateway + LLM (qwen3.5-plus) |
| Deployment | Docker + Docker Compose |

## Project Structure

```
ai-fitness-coach/
├── README.md
├── LICENSE
├── .gitignore
├── docker-compose.yml
├── docs/              # Documentation
├── frontend/          # React frontend
└── backend/           # Node.js/Python backend
```

## Development

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.9+ (for backend, optional)
- Docker & Docker Compose

### Getting Started

```bash
# Clone the repository
git clone https://github.com/icmdw/ai-fitness-coach.git
cd ai-fitness-coach

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

## Documentation

See the `docs/` folder for detailed documentation:

- [Requirements Specification](docs/requirements.md)
- [Database Schema](docs/database-schema.md)
- [API Design](docs/api-design.md)
- [UI Design](docs/ui-design.md)
- [Deployment Guide](docs/deployment.md)

## Team

- **Project Manager**: @manager
- **Frontend Developer**: @alice
- **Backend Developer**: @bob

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ by the AI Fitness Team
