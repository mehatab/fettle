-include .env
run-checks:
	SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL} ./scripts/health-check.sh  
run-dev:
	yarn install
	npm run dev