
MAKEFLAGS += --no-print-directory

.EXPORT_ALL_VARIABLES:
.PHONY: all start prepare css js build html

PATH := $(PWD)/node_modules/.bin:$(PATH)
SHELL := /bin/bash

all: PROD=true
start: PROD=false

all: prepare build html
	gzip --best --keep --no-name public/index.html

clean:
	rm -rf node_modules public tmp && mkdir {public,tmp}
	rm -f package-lock.json

start: prepare css js html
	node server --scss "$(MAKE) css" --js "$(MAKE) js" --watch "src"

prepare:
	@echo ""
	rm -rf public tmp && mkdir {public,tmp}
	cp -r src/assets/* public
	@echo ""

css:
	sass src/main.scss public/main.css --embed-sources --no-error-css --load-path node_modules | tee

js:
	esbuild src/app.js --bundle --sourcemap --define:PROD=false --define:STATIC=false --outfile=public/app.js

html:
	esbuild src/index.js --bundle --define:PROD=$(PROD) --define:STATIC=true --platform=node | node > public/index.html

build:
	node build/esbuild-typescript-uglify.js src/app.js > public/app.min.js
	node build/sass-cleancss.js src/main.scss > public/main.min.css
