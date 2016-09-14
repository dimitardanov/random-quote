

$(document).ready(function() {

  var quotes = {};
  var activeQuoteId = '';
  var favQuoteIds = [];

  var cx = '';
  var googleAPIKey = '';
  var googleBaseSearchURL = 'https://www.google.com/#q=';

  var quoteURLPath = 'http://forismatic.com/en/';
  var quoteAPIURL = 'http://api.forismatic.com/api/1.0/';
  var searchInfo = {
    method: 'getQuote',
    lang: 'en',
    format: 'jsonp',
    jsonp: 'callback'
  };

  var getNewQuote = function () {
    $.ajax({
      url: quoteAPIURL,
      data: searchInfo,
      method: 'GET',
      cache: false,

      crossDomain: true,
      dataType: 'jsonp',
      jsonp: false,
      jsonpCallback: 'callback',

      success: function( response ) {
        var quote = response.quoteText.trim();
        var author = response.quoteAuthor.trim();
        var searchURL = createGoogleSearchURL(author);
        var tweet = generateTweet(quote, author);
        // changeAvatarImage(createQueryString(author));
        $('#active-quote p').text(quote);
        $('#active-quote footer a').text(author);
        $('#active-quote footer a').attr('href', searchURL);
        console.log(response);
        return response;
      },

      error: function( response, status, error ) {
        console.log(response);
        console.log(status);
        console.log(error);
      }

    });
  };


  $('#jswarning').hide();

  $('.btn-new-quote').on('click', getNewQuote);
  $('.btn-new-quote').trigger('click');




  var generateTweet = function (quote, author) {
    return '"' + quote + '"\n' + '- ' + author;
  };

  var createGoogleSearchURL = function(str) {
    var queryStr = createQueryString(str);
    if (queryStr) {
      return googleBaseSearchURL + queryStr;
    } else {
      return queryStr;
    }
  };

  var createQueryString = function (str) {
    if (str.trim().length === 0) {
      return '';
    }
    var terms = str.split(' ');
    terms.filter(function(s) {return s.length > 0;});
    return terms.reduce(function (cur, next) {
      return cur + '+' + next.trim().toLowerCase();
    }, '');
  };



  var createGoogleAPIURL = function (qStr) {
    var url = 'https://www.googleapis.com/customsearch/v1?';
    url += 'imgType=face';
    url += '&num=1&rights=cc_publicdomain+OR+cc_sharealike&safe=medium&searchType=image&fields=items(image(byteSize%2Cheight%2CthumbnailHeight%2CthumbnailLink%2CthumbnailWidth%2Cwidth)%2Clink)';
    url += '&cx=' + cx;
    url += '&key=' + googleAPIKey;
    url += '&q=' + qStr;
    return url;
  };

  var changeAvatarImage = function (queryStr) {
    var $img = $('#avatar');
    $img.show();
    if (queryStr) {
      $.ajax({
        url: createGoogleAPIURL(queryStr),
        method: 'GET',
        cache: false,

        crossDomain: true,
        dataType: 'json',
        jsonp: false,

        success: function( response ) {
          // console.log(response['items'][0]['image']);
          // console.log(response['items'][0]);
          // $img.attr('src', response.items[0].link);
          $img.attr('src', response.items[0].image.thumbnailLink);
        },

        error: function(response, status, error) {
          $img.attr('src', 'http://www.placehold.it/60/000000');
        }
      });
    } else {
      $img.hide();
      $img.attr('src', 'http://www.placehold.it/60/ff0000');
    }
  };

  var getQuoteIdFromObj = function (quoteObj) {
    var url = quoteObj.quoteLink;
    return url.slice(quoteURLPath.length, url.length-1);
  };

  var getQuoteText = function (qId) {
    return quotes[qId].quoteText;
  };

  var getQuoteAuthor = function (qId) {
    return quotes[qId].quoteAuthor;
  };

  var addQuote = function (quoteObj) {
    var qId = getQuoteIdFromObj(quoteObj);
    quotes[qId] = quoteObj;
  };

  var setActiveQuoteId = function (quoteObj) {
    activeQuoteId = getQuoteIdFromObj(quoteObj);
  };

  var preprocessResponse = function (response) {
    response = preprocessQuoteTextStr(response);
    response = preprocessQuoteAuthorStr(response);
    response = createSearchAuthorURL(response);
    return response;
  };

  var preprocessQuoteTextStr = function (quoteObj) {
    quoteObj.quoteText = quoteObj.quoteText.trim();
    return quoteObj;
  };

  var preprocessQuoteAuthorStr = function (quoteObj) {
    quoteObj.quoteAuthor = quoteObj.quoteAuthor.trim();
    if (quoteObj.quoteAuthor) {
      quoteObj.quoteAuthorKnown = true;
    } else {
      quoteObj.quoteAuthor = 'Unknown';
      quoteObj.quoteAuthorKnown = false;
    }
    return quoteObj;
  };

  var createSearchAuthorURL = function (quoteObj) {
    var searchStr = '';
    if (quoteObj.quoteAuthorKnown) {
      searchStr = quoteObj.quoteAuthor;
    } else {
      searchStr = quoteObj.quoteText;
    }
    quoteObj.googleAuthorLink = createGoogleSearchURL(searchStr);
    return quoteObj;
  };

});
