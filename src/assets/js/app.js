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

  var wwdsticky = new Foundation.Sticky($('#framework .sticky'), {
    anchor: 'framework',
    marginTop: ($(window).height() - $('#framework .sticky').height())/32,
    stickyOn: 'medium'
  });

  var unsticky = new Foundation.Sticky($('.emblem .sticky'), {
    anchor: 'unsystem',
    marginTop: ($(window).height() - $('.emblem .sticky').height())/32,
    stickyOn: 'large'
  });

  // console.log(unsticky);

  // unsticky.$element.on('sticky.zf.stuckto:top', function(e){
  //   $('#unsystem .modules-container').addClass('is-stuck');
  // }).on('sticky.zf.unstuckfrom:top', function(e){
  //   $('#unsystem .modules-container').removeClass('is-stuck');
  // });

  // reserve fancy stuff for modern browsers
  if (typeof IntersectionObserver === 'function') {

    // What we do section
    var observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        $(entry.target).toggleClass('in-view', entry.isIntersecting);
      });
    }, {
      rootMargin: '-50% 0%'
    });

    $('.frameworkCard').each(function(i, ele){
      observer.observe(ele);
    });

    // var observer2 = new IntersectionObserver((entries, observer) => {
    //   if (Foundation.MediaQuery.atLeast('large')) {
    //     entries.forEach(entry => {
    //       if (entry.isIntersecting) {
    //         let $entry = $(entry.target);
    //         let offset = $entry.offset();
    //         let top = offset.top + $entry.height() - $(window).height()/2;
    //         $('html,body').animate({
    //           scrollTop: top
    //         }, 250);
    //       }
    //     });
    //   }
    // }, {
    //   rootMargin: '-48% 0%'
    // });

    // $('#toc5 .module').each(function(i, ele){
    //   observer2.observe(ele);
    // });

  }


});
