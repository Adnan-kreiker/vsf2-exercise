<template>
  <div>
    <SfSection
      id="section"
      title-heading="Best Selling Products"
      class="section"
    >
      <SfLoader :class="{ loading }" :loading="loading">
        <SfCarousel
          data-cy="related-products-carousel"
          :settings="{
            peek: 0,
            breakpoints: { 1023: { peek: 0, perView: 2 } },
          }"
          class="carousel"
        >
          <SfCarouselItem
            v-for="(product, i) in products"
            :key="i"
            class="carousel__item"
          >
            <SfProductCard
              badge-label="Best Seller"
              :title="productGetters.getName(product)"
              :image="productGetters.getCoverImage(product)"
              :regular-price="
                $n(productGetters.getPrice(product).regular, 'currency')
              "
              :special-price="
                productGetters.getPrice(product).special &&
                $n(productGetters.getPrice(product).special, 'currency')
              "
              :link="
                localePath(
                  `/p/${productGetters.getId(product)}/${productGetters.getSlug(
                    product
                  )}`
                )
              "
              :is-added-to-cart="isInCart({ product })"
              @click:wishlist="addToWish"
              @click:add-to-cart="addItem({ product, quantity: 1 })"
            />
          </SfCarouselItem>
        </SfCarousel>
      </SfLoader>
    </SfSection>
  </div>
</template>

<script lang="ts">
import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader,
} from '@storefront-ui/vue';

import {
  productGetters,
  useCart,
  useFacet,
  useWishlist,
  facetGetters,
} from '@vue-storefront/shopify';
import { onSSR } from '@vue-storefront/core';
import { computed } from '@nuxtjs/composition-api';

export default {
  name: 'BestSellers',
  components: {
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader,
  },
  setup() {
    const { addItem, isInCart } = useCart();
    const { addItem: addToWish, isInWishlist, removeItem } = useWishlist();
    const { result, loading, search } = useFacet();
    onSSR(async () => {
      await search({
        rootCatSlug: 'best-seller',
        categorySlug: 'best-seller',
        sort: 'latest',
        itemsPerPage: 10,
      });
    });
    return {
      products: computed(() => facetGetters.getProducts(result.value)),
      categoryTree: computed(() => facetGetters.getCategoryTree(result.value)),
      breadcrumbs: computed(() => facetGetters.getBreadcrumbs(result.value)),
      sortBy: computed(() => facetGetters.getSortOptions(result.value)),
      facets: computed(() =>
        facetGetters.getGrouped(result.value, ['color', 'size'])
      ),
      pagination: computed(() => facetGetters.getPagination(result.value)),
      loading,
      productGetters,
      addItem,
      isInCart,
      addToWish,
      isInWishlist,
      removeItem,
    };
  },
};
</script>

<style lang="postcss" scoped>
.section {
  min-height: 450px;
  margin-top: var(--spacer-base);
  margin-bottom: 0;
  .sf-section__content {
    margin: var(--spacer-sm) !important;
  }
}

.carousel {
  margin: 0 auto;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.9375rem 0 2.4375rem 0;
  }
}

.sf-product-card {
  max-width: var(--product-card-max-width, 15.625rem);
  box-shadow: 0 3px 10px rgb(0 0 0 / 20%);
  margin: var(--spacer-xs);
  border-radius: 20px;
}
@media (min-width: 1024px) {
  .sf-product-card {
    max-width: 20rem;
    margin-bottom: 100px;
  }
  ::v-deep .sf-carousel__wrapper {
    height: 570px;
  }
}
/* div#section > div {
  margin: var(--spacer-lg) !important;
} */
::v-deep .sf-heading__title {
  font-weight: bold;
  text-transform: uppercase;
}
</style>
