import { reactive, computed } from '@nuxtjs/composition-api';

const state = reactive({
  isMenuSidebarOpen: false,
  isCartSidebarOpen: false,
  isWishlistSidebarOpen: false,
  isLoginModalOpen: false,
  isCategoryGridView: true,
  isFilterSidebarOpen: false,
  isNavigationSidebarOpen: false,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useUiState = () => {
  const isMenuSidebarOpen = computed(() => state.isMenuSidebarOpen);
  const toggleMenuSidebar = () => {
    state.isMenuSidebarOpen = !state.isMenuSidebarOpen;
  };

  const isCartSidebarOpen = computed(() => state.isCartSidebarOpen);
  const toggleCartSidebar = () => {
    state.isCartSidebarOpen = !state.isCartSidebarOpen;
  };

  const isWishlistSidebarOpen = computed(() => state.isWishlistSidebarOpen);
  const toggleWishlistSidebar = () => {
    state.isWishlistSidebarOpen = !state.isWishlistSidebarOpen;
  };

  const isNavigationSidebarOpen = computed(() => state.isNavigationSidebarOpen);
  const toggleNavigationSidebar = () => {
    state.isNavigationSidebarOpen = !state.isNavigationSidebarOpen;
  };

  const isLoginModalOpen = computed(() => state.isLoginModalOpen);
  const toggleLoginModal = () => {
    state.isLoginModalOpen = !state.isLoginModalOpen;
  };

  const isCategoryGridView = computed(() => state.isCategoryGridView);
  const toggleCategoryGridView = () => {
    state.isCategoryGridView = !state.isCategoryGridView;
  };

  const isFilterSidebarOpen = computed(() => state.isFilterSidebarOpen);
  const toggleFilterSidebar = () => {
    state.isFilterSidebarOpen = !state.isFilterSidebarOpen;
  };

  return {
    isMenuSidebarOpen,
    isCartSidebarOpen,
    isWishlistSidebarOpen,
    isLoginModalOpen,
    isCategoryGridView,
    isFilterSidebarOpen,
    isNavigationSidebarOpen,
    toggleMenuSidebar,
    toggleCartSidebar,
    toggleWishlistSidebar,
    toggleLoginModal,
    toggleCategoryGridView,
    toggleFilterSidebar,
    toggleNavigationSidebar,
  };
};

export default useUiState;
