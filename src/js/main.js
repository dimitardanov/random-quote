

$(document).ready(function() {

  var quotes = {};
  var activeQuoteId = '';
  var favQuoteIds = [];
  var defaultAvatarImgSrc = 'http://www.placehold.it/120x120/cccccc?text=%3F';
  var defaultAuthorImgSrc = 'http://www.placehold.it/400/cccccc?text=%3F';

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
        quoteObj = preprocessResponse(response);
        setActiveQuoteId(quoteObj);
        addQuote(quoteObj);
        // changeAvatarImage(createQueryString(author));
        createActiveQuote(activeQuoteId);
        console.log(quotes[activeQuoteId]);
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

  var getSearchAuthorURL = function (qId) {
    return quotes[qId].googleAuthorLink;
  };

  var getTweetText = function (qId) {
    return quotes[qId].tweetText;
  };

  var getFavBtnData = function (qId) {
    return quotes[qId].favBtnId;
  };

  var getAvatarImgSrc = function (qId) {
    return quotes[qId].avatarImgSrc;
  };

  var setAvatarImgSrc = function (qId, src) {
    quotes[qId].avatarImgSrc = src;
    quotes[qId].isDefaultAvatarImgSrc = false;
    return;
  };

  var getAuthorImgSrc = function (qId) {
    return quotes[qId].authorImgSrc;
  };

  var setAuthorImgSrc = function (qId, src) {
    quotes[qId].authorImgSrc = src;
    quotes[qId].isDefaultAuthorImgSrc = false;
    return;
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
    response = createTweetText(response);
    response = createFavBtnData(response);
    response = createDefaultAvatarImageSrc(response);
    response = createDefaultAuthorImageSrc(response);
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

  var createTweetText = function (quoteObj) {
    quoteObj.tweetText = '"' + quoteObj.quoteText + '"\n' + '- ' + quoteObj.quoteAuthor;
    return quoteObj;
  };

  var createFavBtnData = function (quoteObj) {
    quoteObj.favBtnId = getQuoteIdFromObj(quoteObj);
    return quoteObj;
  };

  var createDefaultAvatarImageSrc = function (quoteObj) {
    quoteObj.avatarImgSrc = defaultAvatarImgSrc;
    quoteObj.isDefaultAvatarImgSrc = true;
    return quoteObj;
  };

  var createDefaultAuthorImageSrc = function (quoteObj) {
    quoteObj.authorImgSrc = defaultAuthorImgSrc;
    quoteObj.isDefaultAuthorImgSrc = true;
    return quoteObj;
  };

  var createQuoteAvatarHTML = function (qId) {
    var $avatarDiv = $('<div>', {
      class: 'media-left'
    });
    var $imgLink = $('<a>', {
      href: '#'
    });
    var $avatarImg = $('<img>', {
      src: getAvatarImgSrc(qId),
      alt: 'author',
      class: 'media-object img-rounded'
    });
    $imgLink.append($avatarImg);
    $avatarDiv.append($imgLink);
    return $avatarDiv;
  };

  var createQuoteBodyHTML = function (qId) {
    var $articleBody = $('<div>', {
      class: 'media-body'
    });
    var $blockquote = $('<blockquote>');
    var $quoteText = $('<p>').text(getQuoteText(qId));
    var $quoteFooter = $('<footer>');
    var $authorLink = $('<a>', {
      href: getSearchAuthorURL(qId),
      target: '_blank'
    }).text(getQuoteAuthor(qId));

    $quoteFooter.append($authorLink);
    $blockquote.append($quoteText);
    $blockquote.append($quoteFooter);
    $articleBody.append($blockquote);
    return $articleBody;
  };

  var createFavBtnHTML = function (qId) {
    return $('<button>', {
      type: 'button',
      class: 'btn btn-fav',
      'data-fav-id': getFavBtnData(qId)
    }).html('<span class="glyphicon glyphicon-heart-empty"></span> Fav!');
  };

  var createTweetBtnHTML = function (qId) {
    var $tweetBtn = $('<a>', {
      class: 'twitter-share-button',
      href: 'https://twitter.com/share',
      'data-size': 'large',
      'data-text': getTweetText(qId)
    }).text('Tweet');

    var $tweetBtnCont = $('<div>', {
      class: 'btn-twitter'
    }).append($tweetBtn);
    twttr.widgets.load($tweetBtn);
    return $tweetBtnCont;
  };

  var createQuoteHTML = function (qId) {
    var $divContainer = $('<div>', {
      class: 'media-holder'
    });

    var $avatarDiv = createQuoteAvatarHTML(qId);
    $divContainer.append($avatarDiv);

    var $articleBody = createQuoteBodyHTML(qId);
    var $favBtn = createFavBtnHTML(qId);
    var $tweetBtn = createTweetBtnHTML(qId);

    $articleBody.append($favBtn);
    $articleBody.append($tweetBtn);
    $divContainer.append($articleBody);

    return $divContainer;
  };

  var createActiveQuote = function (qId) {
    return $('#active-quote').html(createQuoteHTML(qId));
  };

});
