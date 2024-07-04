import {
  ElectronEventType,
  ElectronInvokeType
} from '~/interfaces/electron.types';

export const useElectron = defineStore('useElectron', () => {
  // states
  const state = ref<'' | 'starting'>('');
  // const device = useDevice()

  // computed
  const enabled = computed(() => {
    return typeof window.electron != 'undefined';
  });

  // functions
  const on = window.electron?.on;
  const emit = window.electron?.emit;

  // lifecycle
  if (enabled.value) {
    onMounted(() => {
      state.value = 'starting';
    });

    onNuxtReady(() => {
      on(ElectronEventType.ready, (data) => {
        console.log('on ElectronEventType.ready', data);
      });
      emit(ElectronInvokeType.ready, { foo: 'bar' }, (data) => {
        console.log('callback ElectronInvokeType.ready', data);
      });
    });
  }

  // if(device.userAgent)

  // exports
  return { state, enabled, on, emit };
});
