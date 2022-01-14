<template>
  <div>
    <SfHeader
      title="Vue Storefront 2"
      data-cy="app-header"
      search-placeholder="hah"
      :search-value="term"
      :cart-items-qty="cartTotalItems"
      :account-icon="accountIcon"
      class="sf-header--has-mobile-search"
      :class="{ 'header-on-top': isSearchOpen }"
      :is-search-open="searchBarVisible"
      @click:cart="toggleCartSidebar"
      @click:wishlist="toggleWishlistSidebar"
      @click:account="handleAccountClick"
      @enter:search="changeSearchTerm"
      @change:search="(p) => (term = p)"
    >
      <!-- TODO: add mobile view buttons after SFUI team PR -->
      <template #changeLocale>
        <locale-selector></locale-selector>
      </template>
      <template #searchIcon>
        <SfButton class="sf-button--pure sf-header__action" @click="searchOpen">
          <SfIcon
            icon="search"
            size="xs"
            color="black-primary"
            viewBox="0 0 24 24"
            :coverage="1"
            class="search-icon"
          />
        </SfButton>
      </template>
      <template #logo>
        <nuxt-link :to="localePath('/')" class="sf-header__logo">
          <SfImage
            src="/icons/logo.png"
            alt="Vue Storefront Next"
            class="sf-header__logo-image"
            width="30"
            height="30"
            title="Vue Storefront 2"
          />
        </nuxt-link>
        <h1 class="sf-header__title">{{ title }}</h1>
      </template>

      <template v-if="categories.length > 0" #navigation>
        <div class="navigation-wrapper">
          <SfHeaderNavigationItem
            v-for="cat in categories"
            :key="cat.id"
            class="nav-item"
            :data-cy="'app-header-url_' + cat.handle"
            :label="cat.title"
            :link="localePath('/c/' + cat.handle)"
          />
        </div>
      </template>
      <template #aside>
        <LocaleSelector class="smartphone-only" />
      </template>
      <template #header-icons>
        <div class="sf-header__icons">
          <SfButton
            v-e2e="'app-header-account'"
            class="sf-button--pure sf-header__action"
            @click="handleAccountClick"
          >
            <SfIcon :icon="accountIcon" size="1.25rem" />
          </SfButton>

          <SfButton
            class="sf-button--pure sf-header__action"
            @click="toggleWishlistSidebar"
          >
            <SfIcon class="sf-header__icon" icon="heart" size="1.25rem" />
          </SfButton>

          <SfButton
            v-e2e="'app-header-cart'"
            class="sf-button--pure sf-header__action"
            @click="toggleCartSidebar"
          >
            <SfIcon class="sf-header__icon" icon="empty_cart" size="1.25rem" />
            <SfBadge
              v-if="cartTotalItems"
              class="sf-badge--number cart-badge"
              >{{ cartTotalItems }}</SfBadge
            >
          </SfButton>
        </div>
      </template>

      <template #search>
        <div class="searchbar__wrapper">
          <SfSearchBar
            :value="term"
            :icon="{ size: '1.25rem', color: '#43464E' }"
            aria-label="Search"
            @input="handleSearch"
            @focus="isSearchOpen = true"
          ></SfSearchBar>
          <SfIcon
            icon="cross"
            size="xs"
            viewBox="0 0 24 24"
            :coverage="1"
            @click="closeSearch"
          />
        </div>
      </template>
    </SfHeader>
    <SearchResults
      :visible="isSearchOpen"
      :result="searchResults"
      @keyup.esc="closeSearch"
      @close="closeSearch"
    />
    <SfOverlay
      :visible="isSearchOpen"
      @keyup.esc="isSearchOpen = false"
      @click="isSearchOpen = false"
    />
  </div>
</template>

<script type="module">
import SfHeader from './SfHeader.vue';
import {
  SfImage,
  SfButton,
  SfBadge,
  SfSearchBar,
  SfIcon,
  SfOverlay,
} from '@storefront-ui/vue';
import SearchResults from './SearchResults.vue';
import debounce from 'lodash/debounce';
import useUiState from '~/composables/useUiState';
import { onSSR } from '@vue-storefront/core';
import { computed, ref } from '@nuxtjs/composition-api';

import {
  useCart,
  useWishlist,
  useUser,
  cartGetters,
  searchGetters,
  useCategory,
  useSearch,
} from '@vue-storefront/shopify';
import useUiHelpers from '~/composables/useUiHelpers';
import LocaleSelector from './LocaleSelector';

export default {
  components: {
    SearchResults,
    SfHeader,
    SfImage,
    SfIcon,
    LocaleSelector,
    SfButton,
    SfOverlay,
    SfBadge,
    SfSearchBar,
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup(_, { $router }) {
    const { toggleCartSidebar, toggleWishlistSidebar, toggleLoginModal } =
      useUiState();
    const { changeSearchTerm, getFacetsFromURL } = useUiHelpers();
    const { isAuthenticated, load: loadUser } = useUser();
    const { cart, load: loadCart } = useCart();
    const { search: headerSearch, result } = useSearch('header-search');
    const { search, categories } = useCategory('menuCategories');
    const { load: loadWishlist } = useWishlist();

    const curCatSlug = ref(getFacetsFromURL().categorySlug);
    const cartTotalItems = computed(() => {
      const count = cartGetters.getTotalItems(cart.value);
      return count ? count.toString() : null;
    });

    const searchBarVisible = ref(false);

    const accountIcon = computed(() =>
      isAuthenticated.value ? 'profile_fill' : 'profile'
    );

    // TODO: https://github.com/DivanteLtd/vue-storefront/issues/4927
    const handleAccountClick = () => {
      if (isAuthenticated.value) {
        return $router.push('/my-account');
      }

      toggleLoginModal();
    };

    const title = ref('Vue Storefront 2');
    const iconClicked = () => {
      searchBarVisible.value = !searchBarVisible.value;
    };

    // #region Search Section
    const isSearchOpen = ref(false);
    const searchResults = ref(null);
    const term = ref(getFacetsFromURL().term);
    const handleSearch = debounce(async (searchTerm) => {
      if (!searchTerm.target) {
        term.value = searchTerm;
      } else {
        term.value = searchTerm.target.value;
      }

      await headerSearch({
        term: term.value,
      });
    }, 1000);
    const closeSearch = () => {
      searchBarVisible.value = false;
      console.log('closed');
      if (!isSearchOpen.value) return;
      term.value = '';
      isSearchOpen.value = false;
    };
    const searchOpen = () => {
      searchBarVisible.value = true;
      isSearchOpen.value = true;
    };

    searchResults.value = {
      products: computed(() => searchGetters.getItems(result.value)),
    };
    // #endregion Search Section

    onSSR(async () => {
      await loadUser();
      await loadCart();
      await loadWishlist();
      await search({ slug: '' });
    });

    return {
      accountIcon,
      iconClicked,
      cartTotalItems,
      closeSearch,
      handleAccountClick,
      toggleCartSidebar,
      toggleWishlistSidebar,
      changeSearchTerm,
      term,
      title,
      handleSearch,
      curCatSlug,
      searchResults,
      categories,
      isSearchOpen,
      searchBarVisible,
      searchOpen,
    };
  },
};
</script>

<style lang="scss" scoped>
.sf-header {
  --header-padding: var(--spacer-sm);
  @include for-desktop {
    --header-padding: 10px 20px;
  }
  &__logo-image {
    height: 100%;
  }
}

.header-on-top {
  z-index: 2;
}
.navigation-wrapper {
  display: flex;
  white-space: nowrap;
}

.nav-item {
  .sf-header-navigation-item__item--desktop > *:not(.sf-mega-menu) {
    padding: 0 !important;
  }
  margin: auto 0;
  // .sf-link .sf-header-navigation-item__link {
  // padding: var(--spacer-xxs) var(--spacer-xxs);
  // }
  // .sf-header-navigation-item__item--desktop {
  // pa dding: var(--spacer-md) var(--spacer-xxs);
  // }
  .sf-header-navigation-item__item--mobile {
    display: none;
  }
  &--mobile {
    padding: var(--spacer-xs) 0;
  }
}
.cart-badge {
  position: absolute;
  bottom: 40%;
  left: 40%;
}
.sf-header-navigation-item {
  ::v-deep &__item--mobile {
    display: block;
  }
}
@media (min-width: 1024px) {
  .sf-header__navigation {
    display: flex;
    --header-navigation-margin: 0 !important;
    order: 0;
    flex: 0 0 auto;
  }
}
.sf-search-bar {
  --search-bar-width: 12rem;
}
.sf-header__logo-image {
  margin: auto 0;
}
.sf-header__logo {
  margin-inline: 10px;
}
.sf-header__title {
  margin: 0;
  font-weight: normal;
}
.sf-icon {
  margin: auto 0;
}
.search-icon {
  margin-inline: 20px;
}
</style>
