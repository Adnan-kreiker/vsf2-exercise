<template>
  <div>
    <div>
      <span v-if="!showLocaleSelection" @click="showLocaleSelection = true">{{
        currentLocale
      }}</span>
      <div v-else>
        <nuxt-link :to="switchLocalePath('en')">
          <sf-button @click="showLocaleSelection = false">
            <span>EN</span>
          </sf-button>
        </nuxt-link>
        <span>|</span>
        <nuxt-link :to="switchLocalePath('de')">
          <sf-button @click="showLocaleSelection = false">
            <span>DE</span>
          </sf-button>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script type="module">
import { ref, computed } from '@nuxtjs/composition-api';

export default {
  setup(props, context) {
    const changeLocale = (event) => {
      context.root.$i18n.setLocale(event);
    };
    const showLocaleSelection = ref(false);
    const currentLocale = computed(() => {
      const locale = context.root.$i18n.locale;
      if (locale === 'de') return 'Deutsch';
      else return 'English';
    });
    const { locales, locale } = context.root.$i18n;
    const isLangModalOpen = ref(false);
    const availableLocales = computed(() =>
      locales.filter((i) => i.code !== locale)
    );

    return {
      availableLocales,
      showLocaleSelection,
      currentLocale,
      changeLocale,
      locale,
      isLangModalOpen,
    };
  },
};
</script>

<style lang="scss" scoped>
span {
  font-family: 'Montserrat';
}
span:hover {
  cursor: pointer;
}
.sf-button {
  background: #fff;
  color: #000;
  display: inline-block;
  padding-inline: 1px;
  font-weight: 500;
}
.container {
  margin: 0 -5px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;

  .sf-bottom-modal {
    z-index: 2;
    left: 0;
    @include for-desktop {
      --bottom-modal-height: 100vh;
    }
  }

  .sf-list {
    .language {
      padding: var(--spacer-sm) 0;
    }

    @include for-desktop {
      display: flex;
    }

    .sf-image {
      --image-width: 20px;
      margin-right: 1rem;
      border: 1px solid var(--c-light);
      border-radius: 50%;
    }
  }

  &__lang {
    --image-width: 20px;
    --button-box-shadow: none;
    background: none;
    padding: 0 5px;
    display: flex;
    align-items: center;
    opacity: 0.5;
    border: none;
    &:hover,
    &--selected {
      opacity: 1;
    }
  }
}
</style>
