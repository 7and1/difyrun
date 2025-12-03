.PHONY: dev build start deploy logs down validate backup sync rebuild

# Development
dev:
	npm run dev

# Build
build:
	npm run build

# Start production (local)
start:
	npm run start

# Lint and type check
validate:
	@echo "Validating configuration..."
	npm run lint
	npm run type-check
	@echo "Validation complete!"

# Backup data
backup:
	@echo "Creating backup..."
	@mkdir -p ./backups
	@cp -r ./data ./backups/data-$$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
	@echo "Backup complete!"

# Deploy with Docker
deploy: validate backup
	@echo "Deploying DifyRun..."
	docker compose build
	docker compose up -d
	@echo "Deployment complete!"
	@echo "Site available at http://localhost:3007"

# View logs
logs:
	docker compose logs -f

# Stop containers
down:
	docker compose down

# Sync workflows (manual trigger)
sync:
	@echo "Triggering workflow sync..."
	curl -X POST http://localhost:3007/api/sync \
		-H "Authorization: Bearer $${SYNC_SECRET}" \
		-H "Content-Type: application/json"

# Full rebuild (no cache)
rebuild:
	docker compose down
	docker compose build --no-cache
	docker compose up -d
	@echo "Rebuild complete!"

# Install dependencies
install:
	npm ci

# Clean
clean:
	rm -rf node_modules .next out

# Help
help:
	@echo "Available commands:"
	@echo "  make dev      - Start development server"
	@echo "  make build    - Build for production"
	@echo "  make start    - Start production server locally"
	@echo "  make deploy   - Deploy with Docker"
	@echo "  make logs     - View Docker logs"
	@echo "  make down     - Stop Docker containers"
	@echo "  make sync     - Trigger workflow sync"
	@echo "  make rebuild  - Full Docker rebuild"
	@echo "  make validate - Run lint and type checks"
	@echo "  make install  - Install dependencies"
	@echo "  make clean    - Clean build artifacts"
