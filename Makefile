build:
	uglifyjs autocomplete.js > autocomplete-`grep @version autocomplete.js | sed 's/ \* @version //'`.min.js
