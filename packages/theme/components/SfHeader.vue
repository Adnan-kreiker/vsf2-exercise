<template>
  <div class="sf-header" :class="{ 'is-sticky': sticky, 'is-hidden': hidden }">
    <div class="sf-header__wrapper">
      <header ref="header" class="sf-header__header">
        <div class="top-header-wrapper">
          <slot name="changeLocale"></slot>
          <slot name="searchIcon">
            <!-- <SfSearchBar
              :value="searchValue"
              :placeholder="searchPlaceholder"
              aria-label="Search"
              class="sf-header__search"
              @input="$emit('change:search', $event)"
              @keyup.enter="$emit('enter:search', $event)"
            /> -->
          </slot>
          <slot name="logo">
            <SfLink link="/">
              <!-- <SfImage
                v-if="logo"
                :src="logo"
                :alt="title"
                :width="logoWidth"
                :height="logoHeight"
                class="sf-header__logo"
              />
              <h3 class="sf-header__title">{{ title }}</h3> -->
            </SfLink>
          </slot>
          <slot name="header-icons">
            <!-- <div class="sf-header__icons">
              <SfButton
                :class="{ 'display-none': !accountIcon }"
                class="sf-button--pure sf-header__action"
                data-testid="accountIcon"
                aria-label="Account"
                @click="$emit('click:account')"
              >
                <SfIcon
                  :icon="accountIcon"
                  size="1.25rem"
                  :class="{
                    'sf-header__icon is-active': activeIcon === 'account',
                  }"
                />
              </SfButton>
              <SfButton
                :class="{ 'display-none': !wishlistIcon }"
                class="sf-button--pure sf-header__action"
                data-testid="wishlistIcon"
                aria-label="Wishlist"
                @click="$emit('click:wishlist')"
              >
                <SfIcon
                  class="sf-header__icon"
                  :icon="wishlistIcon"
                  :has-badge="wishlistHasProducts"
                  :badge-label="wishlistItemsQty"
                  size="1.25rem"
                  :class="{
                    'sf-header__icon is-active': activeIcon === 'wishlist',
                  }"
                />
              </SfButton>
              <SfButton
                :class="{ 'display-none': !cartIcon }"
                class="sf-button--pure sf-header__action"
                data-testid="cartIcon"
                aria-label="Cart"
                @click="$emit('click:cart')"
              >
                <SfIcon
                  class="sf-header__icon"
                  :icon="cartIcon"
                  :has-badge="cartHasProducts"
                  :badge-label="cartItemsQty"
                  size="1.25rem"
                  :class="{
                    'sf-header__icon is-active': activeIcon === 'cart',
                  }"
                />
              </SfButton>
            </div> -->
          </slot>
        </div>
        <sf-divider></sf-divider>

        <!-- <div class="sf-header__aside">
          <slot name="aside" />
        </div> -->
        <div v-if="!isSearchOpen" class="sf-header__actions">
          <nav
            class="sf-header__navigation"
            :class="{ 'is-visible': isNavVisible }"
          >
            <slot name="navigation"></slot>
          </nav>
        </div>
        <slot v-else name="search"></slot>
      </header>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import SfHeaderNavigation from '@storefront-ui/vue/src/components/organisms/SfHeader/_internal/SfHeaderNavigation.vue';
import SfHeaderNavigationItem from '@storefront-ui/vue/src/components/organisms/SfHeader/_internal/SfHeaderNavigationItem.vue';
// import SfHeaderNavigation from '@storefront-ui/vue/src/components/SfHeader/_internal';
Vue.component('SfHeaderNavigation', SfHeaderNavigation);
Vue.component('SfHeaderNavigationItem', SfHeaderNavigationItem);
import {
  mapMobileObserver,
  unMapMobileObserver,
} from '@storefront-ui/vue/src/utilities/mobile-observer';
import { isClient } from '@storefront-ui/vue/src/utilities/helpers';

import {
  // SfImage,
  // SfSearchBar,
  // SfButton,
  // SfIcon,
  SfDivider,
  SfLink,
} from '@storefront-ui/vue';
export default {
  name: 'SfHeader',
  components: {
    // SfImage,
    // SfSearchBar,
    // SfButton,
    // SfIcon,
    SfDivider,
    SfLink,
  },
  props: {
    logo: {
      type: [String, Object],
      default: '',
    },
    logoHeight: {
      type: Number,
      default: 35,
    },
    logoWidth: {
      type: Number,
      default: 34,
    },
    title: {
      type: String,
      default: '',
    },
    cartIcon: {
      type: [String, Boolean, Array],
      default: 'empty_cart',
    },
    wishlistIcon: {
      type: [String, Boolean, Array],
      default: 'heart',
    },
    accountIcon: {
      type: [String, Boolean, Array],
      default: 'profile',
    },
    activeIcon: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'account', 'wishlist', 'cart'].includes(value);
      },
    },
    searchPlaceholder: {
      type: String,
      default: 'Search for items',
    },
    searchValue: {
      type: String,
      default: '',
    },
    wishlistItemsQty: {
      type: [String, Number],
      default: '0',
    },
    cartItemsQty: {
      type: [String, Number],
      default: '0',
    },
    isSticky: {
      type: Boolean,
      default: false,
    },
    isNavVisible: {
      type: Boolean,
      default: false,
    },
    isSearchOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      icons: [],
      hidden: false,
      sticky: false,
      scrollDirection: null,
      lastScrollPosition: 0,
      animationStart: null,
      animationLong: null,
      animationDuration: 300,
    };
  },
  computed: {
    ...mapMobileObserver(),
    cartHasProducts() {
      return parseInt(this.cartItemsQty, 10) > 0;
    },
    wishlistHasProducts() {
      return parseInt(this.wishlistItemsQty, 10) > 0;
    },
  },
  watch: {
    scrollDirection: {
      handler() {
        if (!isClient) return;
        window.cancelAnimationFrame(this.animationLong);
        this.animationLong = null;
        this.animationStart = null;
        this.animationLong = window.requestAnimationFrame(
          this.animationHandler
        );
      },
    },
    isSticky: {
      handler(isSticky) {
        if (!isClient) return;
        this.sticky = isSticky;
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.isSticky) {
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
  },
  beforeDestroy() {
    unMapMobileObserver();
    if (this.isSticky) {
      window.removeEventListener('scroll', this.scrollHandler, {
        passive: true,
      });
    }
  },
  methods: {
    animationHandler(timestamp) {
      if (!this.animationStart) this.animationStart = timestamp;
      const progress = timestamp - this.animationStart;
      if (progress < this.animationDuration) {
        this.animationLong = window.requestAnimationFrame(
          this.animationHandler
        );
        return;
      }
      this.hidden = this.scrollDirection === 'down';
    },
    scrollHandler() {
      if (!isClient) return;
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      if (this.refs) {
        if (currentScrollPosition >= this.$refs.header.offsetHeight) {
          this.scrollDirection =
            currentScrollPosition < this.lastScrollPosition ? 'up' : 'down';
        }
      }
      this.lastScrollPosition = currentScrollPosition;
    },
  },
};
</script>
<style lang="scss">
@import '~@storefront-ui/shared/styles/components/organisms/SfHeader.scss';
.top-header-wrapper {
  display: flex;
  justify-content: space-between;
}
.sf-header__actions {
  display: block;
}
.sf-header__header {
  flex-direction: column;
  flex-wrap: nowrap;
}

.searchbar__wrapper {
  display: flex;
  width: 100%;
}
.sf-search-bar[data-v-1b43573c] {
  --search-bar-width: 20rem;
  flex-basis: 50%;
  margin-left: auto;
}
.sf-icon[data-v-1b43573c] {
  margin-left: auto !important;
}

.sf-icon[data-v-1b43573c]:hover {
  cursor: pointer;
}
.top-header-wrapper {
  align-items: center;
}
.sf-divider {
  padding: 1px;
  width: 90%;
  background: var(--_c-red-primary);
}
</style>
