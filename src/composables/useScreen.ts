import { computed } from 'vue';
import { useQuasar } from 'quasar';

const useScreen = () => {
  const $q = useQuasar();

  const isMobile = computed(() => $q.screen.lt.sm);
  const isDesktop = computed(() => $q.screen.gt.xs);

  return {
    isMobile,
    isDesktop,
  };
};

export default useScreen;
