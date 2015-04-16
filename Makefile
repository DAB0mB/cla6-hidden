browserify:
	browserify client > client/cla6-hidden.js
	uglifyjs client/cla6-hidden.js > client/cla6-hidden.min.js

test:
	mocha "test/index.js" --timeout 2000 --reporter nyan

.PHONY: test