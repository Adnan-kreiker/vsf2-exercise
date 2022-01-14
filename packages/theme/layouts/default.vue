<template>
  <div>
    <!-- <LazyHydrate when-visible>
      <TopBar class="desktop-only" />
    </LazyHydrate> -->

    <AppHeader />

    <div id="layout">
      <nuxt :key="route.fullPath" />

      <BottomNavigation />
      <CartSidebar />
      <WishlistSidebar />
      <LoginModal />
      <Notification />
    </div>
    <LazyHydrate when-visible>
      <AppFooter />
    </LazyHydrate>
  </div>
</template>

<script>
import '@storefront-ui/vue/styles.scss';
import AppHeader from '~/components/AppHeader.vue';
import BottomNavigation from '~/components/BottomNavigation.vue';
import AppFooter from '~/components/AppFooter.vue';
// import TopBar from '~/components/TopBar.vue';
import CartSidebar from '~/components/CartSidebar.vue';
import WishlistSidebar from '~/components/WishlistSidebar.vue';
import LoginModal from '~/components/LoginModal.vue';
import LazyHydrate from 'vue-lazy-hydration';
import Notification from '~/components/Notification';
import { onSSR } from '@vue-storefront/core';
import { useRoute } from '@nuxtjs/composition-api';
import {
  useCart,
  useStore,
  useUser,
  useWishlist,
} from '@vue-storefront/shopify';

export default {
  name: 'DefaultLayout',

  components: {
    LazyHydrate,
    // TopBar,
    AppHeader,
    BottomNavigation,
    AppFooter,
    CartSidebar,
    WishlistSidebar,
    LoginModal,
    Notification,
  },

  setup() {
    const route = useRoute();
    const { load: loadStores } = useStore();
    const { load: loadUser } = useUser();
    const { load: loadCart } = useCart();
    const { load: loadWishlist } = useWishlist();

    onSSR(async () => {
      await Promise.all([loadStores(), loadUser(), loadCart(), loadWishlist()]);
    });

    return {
      route,
    };
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&family=Roboto+Mono:wght@300;500;700&display=swap');
:root {
  @include generate-color-variants(--_c-red-primary, #e73b24);
  @include assign-color-variants(--c-primary, --_c-red-primary);
  @include assign-color-variants(--c-primary-variant, --_c-red-secondary);
  --font-family--primary: 'Roboto Mono';
  --font-family--secondary: 'Montserrat';
}

#layout {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1440px;
    margin: auto;
  }
}

.no-scroll {
  overflow: hidden;
  height: 100vh;
}

// Reset CSS

html {
  width: auto;

  @include for-mobile {
    overflow-x: hidden;
  }
}
body {
  overflow-x: hidden;
  color: var(--c-text);
  font-size: var(--font-size--base);
  font-family: var(--font-family--primary);
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
  color: var(--c-link);
  &:hover {
    color: var(--c-link-hover);
  }
}
h1 {
  font-family: var(--font-family--secondary);
  font-size: var(--h1-font-size);
  line-height: 1.6;
  margin: 0;
}
h2 {
  font-family: var(--font-family--secondary);
  font-size: var(--h2-font-size);
  line-height: 1.6;
  margin: 0;
}
h3 {
  font-family: var(--font-family--secondary);
  font-size: var(--h3-font-size);
  line-height: 1.6;
  margin: 0;
}
h4 {
  font-family: var(--font-family--secondary);
  font-size: var(--h4-font-size);
  line-height: 1.6;
  margin: 0;
}
p {
  font-family: var(--font-family--secondary);
}

.sf-button[data-cy='login-btn_submit'] {
  &:hover {
    background-color: var(--_c-black-171717);
  }
}
.sf-header-navigation-item__item--desktop > *:not(.sf-mega-menu) {
  padding-top: var(--spacer-sm);
  padding-bottom: var(--spacer-sm);
  padding-inline: var(--spacer-lg);
}
.sf-header__header {
  padding: 0;
}
.hero {
  /* max-height: 545px; */
  .glide__track {
    max-height: calc(100vh - 111px);
  }
}
h1.sf-header__title {
  font-size: 25px;
}
</style>
