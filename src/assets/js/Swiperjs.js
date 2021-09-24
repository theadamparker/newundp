import $ from 'jquery';
import { MediaQuery } from 'foundation-sites/js/foundation.util.mediaQuery';
import { GetYoDigits } from 'foundation-sites/js/foundation.core.utils';
import { Plugin } from 'foundation-sites/js/foundation.core.plugin';
import { Swiper, Navigation, Autoplay } from 'swiper/js/swiper.esm.js';

class Swiperjs extends Plugin {

    _setup(element, options) {

        Swiper.use([Navigation, Autoplay]);

        this.$element = element;
        this.options = $.extend({}, Swiperjs.defaults, this.$element.data(), options);
        this.className = 'Swiperjs'; // ie9 back compat

        this.id = this.$element.attr('id') || GetYoDigits(6, 'swiperjs');
        this.$element.attr('id',this.id);

        // fix buttons located outside of the element
        var siblings = element.siblings('.swiper-button-prev,.swiper-button-next');
        if (siblings.length > 1) {
            this.options = $.extend(this.options, {navigation: {
                    prevEl: $(siblings[0]),
                    nextEl: $(siblings[1]),
                }
            });
        }

        // init widget
        this._init();
    }

    _init() {
        var that = this;

        // destroy/render on size change
        if (that.options.renderOn) {
            $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
                if (newSize == that.options.renderOn) {
                    that.render();
                } else if (oldSize == that.options.renderOn) {
                    that.destroy();
                }
            });

            // first run, render carousel only if the screen is small enough
            if (MediaQuery.upTo(that.options.renderOn)) {
                that.render();
            }
        } else {
            that.render();
        }

    }

    render() {
        var that = this;
        if (that.options.renderOn) {
            that.toggleClasses();
        }
        that.$swiper = new Swiper('#' + that.id, that.options);
    }

    destroy() {
        if (this.$swiper) {
            this.$swiper.destroy();
            this.toggleClasses();
        }
    }

    toggleClasses() {
        var $element = this.$element;
        var children = $element.find('[data-shadow-class]');
        children.push($element);
        children.each(function(i, ele) {
            var oldClass = $(ele).attr('class') || '';
            var newClass = $(ele).data('shadowClass') || '';
            $(ele).removeClass(oldClass).addClass(newClass).data('shadowClass', oldClass);
        });
    }

}

Swiperjs.defaults = {
    spaceBetween: 30,
    autoplay: {
        delay: 5000
    },
    loop: true,
    renderOn: 'small',
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
}

export {Swiperjs};
