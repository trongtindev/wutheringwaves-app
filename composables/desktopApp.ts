import {
  DesktopAppGameType,
  type IDesktopAppActor,
} from '~/interfaces/desktopApp';

export const useDesktopApp = defineStore('useDesktopApp', () => {
  // states
  const state = ref<'' | 'starting'>('');
  const player = ref<IDesktopAppActor>();
  const objects = ref<IDesktopAppActor[]>([]);

  // computed
  const enabled = computed(() => {
    return typeof window.electron != 'undefined';
  });

  // functions
  const on = <T>(
    eventName: string,
    listener: (data: T, callback?: () => Promise<void> | void) => void,
  ) => {
    if (!window.electron) return;
    window.electron.on(eventName, listener);
  };
  const emit = <T1, T2>(
    eventName: string,
    data: T1,
    callback?: (result: T2, error?: string) => void,
  ) => {
    if (!window.electron) return;
    window.electron.emit<T1, T2>(eventName, data, callback);
  };

  // lifecycle
  if (import.meta.client && enabled.value) {
    onMounted(() => {
      on<IDesktopAppActor>(DesktopAppGameType.playerInfo, (data) => {
        player.value = data;
      });
      on<IDesktopAppActor[]>(DesktopAppGameType.objectList, (data) => {
        objects.value = data;
      });
    });
  }

  // exports
  return {
    state,
    player,
    objects,
    enabled,
    on,
    emit,
  };
});
