## Website for generating random quotes

The website uses the http://forismatic.com/en/api/ API to load a random quote. It also tries to find an avatar image of the author of the quote and show it next to the quote. The image is the first result from a Google image search API.

Each quote is added to a list containing all the displayed quotes for the session. A user can tweet the quote and/or add the quote to a favorites list. New sessions start with empty quote and favorite quotes lists. Both lists are non-persistent.

For the site to show an image of the author, the user has to provide a Custom Google Search Engine ID and Google Custom Search API keys.
