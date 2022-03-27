all: build

.PHONY: build
build:
	npm run compile && cd .. && cp -r smt-ide ~/.vscode/extensions/
