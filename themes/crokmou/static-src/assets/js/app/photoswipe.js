$(document).ready(function() {
  'use strict';

  const initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    const parseThumbnailElements = async function(el) {
      let thumbElements = el.querySelectorAll('figure'),
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          imgEl,
          item;

      for(let i = 0; i < numNodes; i++) {

        figureEl = thumbElements[i]; // <figure> element

        // include only element nodes
        if(figureEl.nodeType !== 1) {
          continue;
        }

        linkEl = figureEl.children[0]; // <a> element

        imgEl = linkEl.children[0]; // <img> element
        const img = imgEl.naturalWidth ? imgEl : await addImageProcess(linkEl.getAttribute('href'));
        imgEl.src = img.src;
          // create slide object
        if(!img.error) {
          item = {
            src: img.src,
            w: parseInt(img.naturalWidth, 10),
            h: parseInt(img.naturalHeight, 10)
          };
          if(figureEl.children.length > 1) {
            // <figcaption> content
            item.title = figureEl.children[1].innerHTML;
          }

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
        }
      }
      return items;
    };

    // find nearest parent element
    const closest = function closest(el, fn) {
      return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    const onThumbnailsClick = function(e) {
      e = e || window.event;
      const eTarget = e.target || e.srcElement;

      // find root element of slide
      const clickedListItem = closest(eTarget, function(el) {
        return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
      });

      if(!clickedListItem) {
        return;
      } else {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
      }

      const clickedGallery = closest(eTarget, (el) =>
        el.classList.contains('single'));
      const childNodes = clickedGallery.querySelectorAll('figure');
      const numChildNodes = childNodes.length;
      let nodeIndex = 0,
          index;

      for (let i = 0; i < numChildNodes; i++) {
        if(childNodes[i].nodeType !== 1) {
          continue;
        }

        if(childNodes[i] === clickedListItem) {
          index = nodeIndex;
          break;
        }
        nodeIndex++;
      }

      if(index >= 0) {
        // open PhotoSwipe if valid index found
        openPhotoSwipe( index, clickedGallery );
      }
      return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    const photoswipeParseHash = function() {
      const hash = window.location.hash.substring(1),
          params = {};

      if(hash.length < 5) {
        return params;
      }

      const consts = hash.split('&');
      for (let i = 0; i < consts.length; i++) {
        if(!consts[i]) {
          continue;
        }
        const pair = consts[i].split('=');
        if(pair.length < 2) {
          continue;
        }
        params[pair[0]] = pair[1];
      }

      if(params.gid) {
        params.gid = parseInt(params.gid, 10);
      }

      return params;
    };

    const openPhotoSwipe = async function(index, galleryElement, disableAnimation, fromURL) {
      const pswpElement = document.querySelectorAll('.pswp')[0];
      let gallery;
      let options;
      let items;
      console.log('waiting...');
      items = await parseThumbnailElements(galleryElement);
      console.log('ok')
      // define options (if needed)
      options = {
        showHideOpacity: true,
        // define gallery index (for URL)
        galleryUID: galleryElement.getAttribute('data-pswp-uid') || 1,

        getThumbBoundsFn: function(index) {
          // See Options -> getThumbBoundsFn section of documentation for more info
          const thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
              pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
              rect = thumbnail.getBoundingClientRect();

          return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        }

      };

      // PhotoSwipe opened from URL
      if(fromURL) {
        if(options.galleryPIDs) {
          // parse real index when custom PIDs are used
          // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
          for(let j = 0; j < items.length; j++) {
            if(items[j].pid == index) {
              options.index = j;
              break;
            }
          }
        } else {
          // in URL indexes start from 1
          options.index = parseInt(index, 10) - 1;
        }
      } else {
        options.index = parseInt(index, 10);
      }

      // exit if index not found
      if( isNaN(options.index) ) {
        return;
      }

      if(disableAnimation) {
        options.showAnimationDuration = 0;
      }

      // Pass data to PhotoSwipe and initialize it
      gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
    };

    // loop through all gallery elements and bind events
    const galleryElements = document.querySelectorAll( gallerySelector );

    for(let i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i+1);
      galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    const hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
      openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
  };

  function addImageProcess(src){
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        resolve({error: 'error'});
      };
      img.src = src;
    })
  }

  initPhotoSwipeFromDOM('.single');

});