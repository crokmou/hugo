$(document).ready(function() {
  'use strict';

  const SPRITE_URL = '/assets/images/svg/sprite.svg';

  const $pageContainer = $('#page-container');
  const $bodyHtml = $('body, html');

  const App = (function App() {
    new IOlazy();
    (function CARDS() {
      $('[rel="js-card"]').each(function() {
        let $this      = $(this);
        let $share     = $this.find('[rel="js-share"]');
        let $toggle    = $share.find('[rel="js-toggle"]');

        $toggle.on('click', toggleShare);

        function toggleShare() {
          $share.toggleClass('visible');
        }
      });
    })();

    return {init: App};
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

    $pageContainer.on('click', '.js-page-link, .pagination a', function(event) {
      event.preventDefault();
      if (window.location === this.href) {
        return;
      }
      History.pushState(null, $(this).data('browser-title'), this.href);
    });

    History.Adapter.bind(window, 'statechange', function() {
      const state = History.getState();
      const $a = $('a');
      $a.css('cursor', 'progress');
      $bodyHtml.css('cursor', 'progress');
      $.get(state.url, function(res) {
        $a.css('cursor', 'default');
        $bodyHtml.css('cursor', 'default');
        $.each($(res), function(index, elem) {
          if ($pageContainer[0].id !== elem.id) {
            return;
          }
          $pageContainer.html($(elem).html()).promise().done(function(res) {
            $bodyHtml.animate({scrollTop: 0}, 300);
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
