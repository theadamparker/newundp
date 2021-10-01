import $ from 'jquery';
import 'what-input';
import lazySizes from 'lazysizes';
// import Swiper from 'swiper';

// Foundation JS relies on a global varaible. In ES6, all imports are hoisted
// to the top of the file so if we used`import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
// require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
import './lib/foundation-explicit-pieces';

// import {Waves} from'./Waves';
// Foundation.plugin(Waves, 'Waves');

// Swiper foundation plugin init
import { Swiperjs } from './Swiperjs';
Foundation.plugin(Swiperjs, 'Swiperjs');

$(document).foundation();

$(() => {

  // init smoothscrolling in offcanvas
  $('#menu a').on('click', function () {
    var loc = $(this).attr('href');
    $('#offCanvas').one('close.zf.offCanvas', function () {
      Foundation.SmoothScroll.scrollToLoc(loc);
    }).foundation('close');
  });

  var wwd = new Foundation.Sticky($('#framework .sticky'), {
    anchor: 'framework',
    marginTop: ($(window).height() - $('#framework .sticky').height())/32,
    stickyOn: 'medium'
  });

  // reserve fancy stuff for modern browsers
  if (typeof IntersectionObserver === 'function') {
    var wwdobserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        $(entry.target).toggleClass('in-view', entry.isIntersecting);
      });
    }, {
      rootMargin: '-50% 0%'
    });

    $('.frameworkCard').each(function(i, ele){
      wwdobserver.observe(ele);
    });

  }


});
