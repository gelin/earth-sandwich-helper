.PHONY: build
build: install
	npm run build

.PHONY: install
install:
	npm ci || npm install

.PHONY: clean
clean:
	rm -rf ./build/*

.PHONY: dev
dev:
	npm run dev
