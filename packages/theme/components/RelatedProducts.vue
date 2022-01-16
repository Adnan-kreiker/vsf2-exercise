<template>
  <SfSection :title-heading="title" class="section">
    <SfLoader :class="{ loading }" :loading="loading">
      <SfCarousel
        data-cy="related-products-carousel"
        :settings="pdpUpsellSettings"
        class="carousel"
      >
        <SfCarouselItem
          v-for="(product, i) in products"
          :key="i"
          class="carousel__item"
        >
          <SfProductCard
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
</template>

<script lang="ts">
import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader,
} from '@storefront-ui/vue';

import { productGetters, useCart, useWishlist } from '@vue-storefront/shopify';
export default {
  name: 'RelatedProducts',
  components: {
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader,
  },
  props: {
    title: String,
    products: Array,
    loading: Boolean,
  },
  setup() {
    const { addItem, isInCart } = useCart();
    const { addItem: addToWish, isInWishlist, removeItem } = useWishlist();
    return {
      productGetters,
      addItem,
      isInCart,
      addToWish,
      isInWishlist,
      removeItem,
    };
  },
  data() {
    return {
      pdpUpsellSettings: {
        type: 'slider',
        perView: 4,
        peek: 0,
        autoplay: false,
        animationDuration: 600,
        gap: 20,
        breakpoints: {
          1270: {
            perView: 3,
          },
          767: {
            perView: 2,
          },
          510: {
            perView: 1,
          },
        },
      },
    };
  },
};
</script>

<style lang="postcss" scoped>
.section {
  margin-top: var(--spacer-base);
}

.carousel {
  margin: 0 auto;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.9375rem 0 2.4375rem 0;
    max-width: 200px;
  }
}
.sf-product-card {
  margin: var(--spacer-base) var(--spacer-sm);
  box-shadow: 0 3px 10px rgb(0 0 0 / 20%);
  min-width: 14rem;
  border-radius: 20px;
}
::v-deep .sf-heading__title {
  font-weight: bold;
  text-transform: uppercase;
}
@media (min-width: 1160px;) {
  ::v-deep .sf-carousel__wrapper .glide .glide__track {
    max-height: 700px !important;
  }
}
::v-deep .sf-carousel__wrapper .glide .glide__track {
  max-height: 480px !important;
}
@media (min-width: 1024px) {
  .sf-section {
    --section-margin: var(--spacer-lg);
  }
}
</style>
::v-deep .glide__track {
