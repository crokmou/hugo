$(document).ready(function() {
  'use strict';

  let SPRITE_URL = '/images/svg/sprite.svg';

  let $pageContainer = $('#page-container');

  let App = (function App() {
    /**
     * Init selectric for dropdown
     */
    $('select').selectric({
      arrowButtonMarkup : '',
      maxHeight         : 200,
      optionsItemBuilder: function(itemData) {
        let image = $(itemData.element[0]).data('image');
        return itemData.className === 'with-icon' ? '<img src="' + image +
          '"/>' + itemData.text : itemData.text;
      },
      labelBuilder      : function(currItem) {
        let image = $(currItem.element[0]).data('image');
        return currItem.className === 'with-icon'
          ? '<div class="with-icon"><img src="' + image + '"/>' +
          currItem.text + '</div>'
          : currItem.text;
      },
    });

    (function CARDS() {
      $('[rel="js-card"]').each(function() {
        let $this      = $(this);
        let $share     = $this.find('[rel="js-share"]');
        let $shareWith = $share.find('[rel="js-share-with"]');
        let $toggle    = $share.find('[rel="js-toggle"]');
        let $comment   = $this.find('[rel="js-comments"]');

        $toggle.on('click', toggleShare);

        function toggleShare() {
          $share.toggleClass('visible');
        }
      });
    })();

    return {init: App};
  })();

  // Utilities
  let QueryParams = (function getQueryParams() {
    function param(qs) {
      let params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
      if (qs) {
        qs = qs.split('+').join(' ');
        while (tokens = re.exec(qs)) {
          params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
      }
    }

    return {
      get: param,
    };
  })();
  let Cookie      = (function Cookie() {
    const hostName = location.hostname.match(/\.(.*)/);
    const COOKIE_HOST = hostName && hostName[0];

    function setCookie(name, value, days) {
      let expires;
      if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
      } else {
        expires = '';
      }
      document.cookie = name + '=' + value + expires + '; path=/;domain=' +
        COOKIE_HOST;
    }

    function getCookie(name) {
      let nameEQ = name + '=';
      let ca     = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }

    function removeCookie(name) {
      setCookie(name, '', -1);
    }

    return {
      set   : setCookie,
      get   : getCookie,
      remove: removeCookie,
    };
  })();
  /**
   * Ajax loader to insert the sprite svg dynamically at the bottom of the document
   */
  (function loadSvg() {
    'use strict';
    let ajax = new XMLHttpRequest();
    ajax.open('GET', SPRITE_URL, true);
    ajax.onload = function() {
      let div       = document.createElement('div');
      div.innerHTML = ajax.responseText;
      document.body.insertBefore(div, document.body.childNodes[0]);
    };
    ajax.send();
  })();
  (function($, History) {
    analytics(null, document.title);

    if (!History.enabled) {
      return false;
    }

    $pageContainer.on('click', '.js-page-link', function(event) {
      event.preventDefault();
      if (window.location === this.href) {
        return;
      }
      History.pushState(null, $(this).data('browser-title'), this.href);
    });

    History.Adapter.bind(window, 'statechange', function() {
      let state = History.getState();
      $.get(state.url, function(res) {
        $.each($(res), function(index, elem) {
          if ($pageContainer[0].id !== elem.id) {
            return;
          }
          $pageContainer.html($(elem).html()).promise().done(function(res) {
            $('body, html').animate({scrollTop: 0}, 150);
            App.init();
            analytics(res, state.title);
          });
        });
      });
    });
    function analytics(res, title) {
      if (typeof ga === 'function' && (!res || res.length !== 0)) {
        ga('set', {
          page : window.location.pathname,
          title: title,
        });
        ga('send', 'pageview');
      }
    }
  })(jQuery, window.History);
});
