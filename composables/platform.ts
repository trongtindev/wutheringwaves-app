import { defineStore } from 'pinia';

/**
 * @deprecated
 */
export const usePlatform = defineStore('usePlatform', () => {
  const isiOS = computed(() => /iPhone|iPad|iPod/i.test(navigator.userAgent));
  const isAndroid = computed(() => /Android/i.test(navigator.userAgent));
  const isMobile = computed(() => isiOS.value && isAndroid.value);
  return { isiOS, isAndroid, isMobile };
});
