

$(document).ready(function() {

  var quotes = {};
  var activeQuoteId = '';
  var favQuoteIds = [];
  var defaultAvatarImgSrc = 'http://www.placehold.it/120x120/cccccc?text=%3F';
  var defaultAuthorImgSrc = 'http://www.placehold.it/400/cccccc?text=%3F';
  var $activeQuoteHTML;
  var $quoteList = $('#quote-list');

  var cx = '';
  var googleAPIKey = '';
  var enableGoogleAPICalls = false;
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
    $('.btn-new-quote').prop('disabled', true);
    createSpinner();
    if (activeQuoteId !== '') {
      moveActiveQuoteToList();
    }

    $.ajax({
      url: quoteAPIURL,
      data: searchInfo,
      method: 'GET',
      cache: false,

      crossDomain: true,
      dataType: 'jsonp',
      jsonp: false,
      jsonpCallback: 'callback',

      success: function (response) {
        removeSpinner();
        quoteSuccessFunc(response);
      },

      error: function( response, status, error ) {
        console.log(response);
        console.log(status);
        console.log(error);
      },

      complete: function (jqXHR, status) {
        $('.btn-new-quote').prop('disabled', false);
      }

    });
  };

  var quoteSuccessFunc = function( response ) {
    quoteObj = preprocessResponse(response);
    setActiveQuoteId(quoteObj);
    addQuote(quoteObj);
    createActiveQuote(activeQuoteId);
    if (enableGoogleAPICalls) {
      var author = quoteObj.quoteAuthor;
      changeAvatarImage(createQueryString(author));
    }
    console.log(quotes[activeQuoteId]);
    return response;
  };

  var moveActiveQuoteToList = function () {
    $activeQuoteHTML = $('#active-quote div');
    $('#active-quote').addClass('blurry');
    $activeQuoteHTML.fadeOut(400, function() {
      $(this).remove();
      $('#active-quote').removeClass('blurry');
    });
    var $media = $('<article></article>', {'class': 'media'}).hide();
    $media.append(createQuoteHTML(activeQuoteId));
    $media.prependTo($quoteList);
    $media.slideDown();
  };


    var createSpinner = function () {
      var $spinner = $('<p></p>', {'class': 'spinner'});
      $spinner.append($('<span></span>', {'class': 'glyphicon glyphicon-refresh'}));
      $spinner.hide();
      $('#active-quote').append($spinner);
      $spinner.fadeIn();
    };

    var removeSpinner = function () {
      var $spinner = $('#active-quote p');
      $spinner.stop()
              .fadeOut(function () {
                $(this).remove();
              });
    };

  var getObjFromQueryStr = function () {
    var qObj = {};
    var qStr = window.location.search.substring(1);
    qStr = decodeURIComponent(qStr);
    if (qStr !== '') {
      var ql = qStr.split('&');
      ql.map(function (s) {
        var kv = s.split('=');
        qObj[kv[0]] = kv[1];
      });
    }
    return qObj;
  };

  var setImgSearchCredentials = function (qObj) {
    if (qObj.hasOwnProperty('cx') && qObj.hasOwnProperty('k')) {
      cx = qObj.cx;
      googleAPIKey = qObj.k;
      enableGoogleAPICalls = true;
    }
  };

  setImgSearchCredentials(getObjFromQueryStr());


  $('#jswarning').hide();

  $('.btn-new-quote').on('click', getNewQuote);
  $('.btn-new-quote').prop('disabled', false)
                     .trigger('click');





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
    var $img = $('#active-quote img');
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
          var imgSrc = response.items[0].link;
          var avatarImgSrc = response.items[0].image.thumbnailLink;
          setAvatarImgSrc(activeQuoteId, avatarImgSrc);
          setAuthorImgSrc(activeQuoteId, imgSrc);
          $img.attr('src', avatarImgSrc);
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
    var $avatarDiv = $('<div></div>', {
      'class': 'media-left'
    });
    var $imgLink = $('<a></a>', {
      href: '#',
      'data-quote-id': qId
    });
    var $avatarImg = $('<img>', {
      src: getAvatarImgSrc(qId),
      alt: 'author',
      'class': 'media-object img-rounded'
    });
    $imgLink.append($avatarImg);
    $avatarDiv.append($imgLink);
    return $avatarDiv;
  };

  var createQuoteBodyHTML = function (qId) {
    var $articleBody = $('<div></div>', {
      'class': 'media-body'
    });
    var $blockquote = $('<blockquote></blockquote>');
    var $quoteText = $('<p></p>').text(getQuoteText(qId));
    var $quoteFooter = $('<footer></footer>');
    var $authorLink = $('<a></a>', {
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
    var $btn = $('<button></button>', {
      type: 'button',
      'class': 'btn btn-fav',
      'data-fav-id': getFavBtnData(qId)
    });
    var btnColorClass = 'btn-fav-col';
    var btnText = 'Fav!';
    var btnIconClass = 'glyphicon glyphicon-heart-empty';
    if (favQuoteIds.indexOf(qId) !== -1) {
      btnColorClass = 'btn-unfav-col';
      btnText = 'unFav!';
      btnIconClass = 'glyphicon glyphicon-heart';
    }
    btnText = ' ' + btnText;
    $btn.addClass(btnColorClass);
    $btn.append($('<span></span>', {'class': btnIconClass}));
    $btn.append($('<span></span>', {'class': 'btn-fav-text'}).text(btnText));
    return $btn;
  };

  var createTweetBtnHTML = function (qId) {
    var $tweetBtn = $('<a></a>', {
      'class': 'twitter-share-button',
      href: 'https://twitter.com/share',
      'data-size': 'large',
      'data-url': '/',
      'data-text': getTweetText(qId)
    }).text('Tweet');

    var $tweetBtnCont = $('<div></div>', {
      'class': 'btn-twitter'
    }).append($tweetBtn);
    twttr.widgets.load($tweetBtn);
    return $tweetBtnCont;
  };

  var createQuoteHTML = function (qId) {
    var $divContainer = $('<div></div>', {
      'class': 'media-holder'
    });

    if (enableGoogleAPICalls) {
      var $avatarDiv = createQuoteAvatarHTML(qId);
      $divContainer.append($avatarDiv);
    }


    var $articleBody = createQuoteBodyHTML(qId);
    var $favBtn = createFavBtnHTML(qId);
    var $tweetBtn = createTweetBtnHTML(qId);

    $articleBody.append($favBtn);
    $articleBody.append($tweetBtn);
    $divContainer.append($articleBody);

    return $divContainer;
  };

  var createActiveQuote = function (qId) {
    var $quoteHTML = createQuoteHTML(qId).hide();
    var $activeQuote = $('#active-quote').html($quoteHTML);
    $('#active-quote').addClass('blurry');
    $quoteHTML.fadeIn();
    $('#active-quote').removeClass('blurry');
    return $activeQuote;
  };

  var toggleFavButton = function () {
    var $this = $(this);
    var $heart = $('span:first', $this);
    var $text = $('span:last', $this);
    var qId = $this.attr('data-fav-id');
    var idIndex = favQuoteIds.indexOf(qId);
    if (idIndex === -1) {
      favQuoteIds.push(qId);
      $this.addClass('btn-unfav-col')
           .removeClass('btn-fav-col');
      $heart.removeClass('glyphicon-heart-empty')
            .addClass('glyphicon-heart');
      $text.text(' unFav!');
      addFavQuoteToDropdown(qId);
    } else {
      favQuoteIds.splice(idIndex, 1);
      $this.addClass('btn-fav-col')
           .removeClass('btn-unfav-col');
      $heart.removeClass('glyphicon-heart')
            .addClass('glyphicon-heart-empty');
      $text.text(' Fav!');
      removeUnFavedQuoteFromDropdown(qId);
    }
  };

  $('section').on('click', '.btn[data-fav-id]', toggleFavButton);


  var addFavQuoteToDropdown = function (qId) {
    var quoteText = getQuoteText(qId);
    var $lastListItem = $('.dropdown-menu li:last');
    if (favQuoteIds.length === 1) {
      $('.dropdown-menu li').not('[role="separator"]').remove();
    }
    var $li = $('<li></li>', {'data-quote-id': qId,});
    var $a = $('<a href=#></a>').text(quoteText);
    $li.append($a);
    $lastListItem.before($li);
  };

  var removeUnFavedQuoteFromDropdown = function (qId) {
    $('li[data-quote-id='+qId+']').slideUp(function () {
      $(this).remove();
    });
    if (favQuoteIds.length === 0) {
      var $li = $('<li></li>').append($('<a href=#></a>').text('Yo have no favorite quotes'));
      $('.dropdown-menu li:last').before($li);
    }
  };

  var constructQuoteModal = function () {
    var $this = $(this);
    var $modalBody = $('.modal-body');
    var qId = $this.data('quote-id');
    var quote = quotes[qId];
    $('img', $modalBody).attr('src', quote.authorImgSrc);
    $('p', $modalBody).text(quote.quoteText);
    $('#quoteModalLabel').text(quote.quoteAuthor);
    $('#quoteModal').modal('show');
  };

  $('.dropdown-menu').on('click', 'li[data-quote-id]', constructQuoteModal);

  $('section').on('click', 'a[data-quote-id]', constructQuoteModal);

});
