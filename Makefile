install:
	npm ci

dev:
	npm run dev

test:
	npx playwright test --reporter=list

test-ui:
	npx playwright test --ui

test-headed:
	npx playwright test --headed

lint:
	npx eslint .

.PHONY: install dev test test-ui test-headed lint
