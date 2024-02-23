-include .env
run-checks:
	echo "*.log" > public/status/.gitignore
	SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL} ./scripts/health-check.sh  
run-dev:
	yarn install
	npm run dev