<template>
  <div>
    <h2>WHAT ARE YOU SHOPPING FOR?</h2>
    <div class="suggestion-container">
      <nuxt-link
        v-for="(suggestion, i) in suggestions"
        :key="i"
        :to="suggestion.link"
      >
        <div class="suggestion">
          <img :src="suggestion.image" alt="" />
          <h2 class="suggestion-text">{{ suggestion.text }}</h2>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShoppingFor',
  data() {
    return {
      suggestions: [
        {
          text: 'Accessories',
          image: '/homepage/suggestions/sug1.jpg',
          link: '/c/accessories',
        },
        {
          text: 'Dresses',
          image: '/homepage/suggestions/sug2.webp',
          link: '/c/event-dressing',
        },
        {
          text: 'Clothes',
          image: '/homepage/suggestions/sug3.jpg',
          link: '/c/clothes',
        },
      ],
    };
  },
};
</script>

<style scoped>
.suggestion-container {
  display: flex;
  justify-content: space-evenly;
}
.suggestion {
  position: relative;
}
.suggestion-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  background: rgba(85, 84, 84, 0.8);
  padding: 4px;
}
.suggestion-text:hover {
  cursor: pointer;
}
img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}
h2 {
  padding: var(--spacer-lg);
}
</style>
