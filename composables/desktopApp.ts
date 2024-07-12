import {
  ElectronEventType,
  ElectronInvokeType
} from '~/interfaces/electron.types';

export const useDesktopApp = defineStore('useDesktopApp', () => {
  // states
  const state = ref<'' | 'starting'>('');
  const listeners = ref<
    {
      id: string;
      eventName: string;
      handler: any;
    }[]
  >([]);
  const callbacks = ref<
    {
      id: string;
      handler: (data: any) => Promise<void> | void;
    }[]
  >([]);

  // events
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMessage = (event: any) => {
    if (typeof event.data !== 'object') return;
    if (!event.data.EventName) return;

    const eventName = event.data.EventName;
    const data = JSON.parse(event.data.Data);

    listeners.value
      .filter((listener) => listener.eventName === eventName)
      .forEach((listener) => {
        listener.handler(data);
      });
  };

  // computed
  const enabled = computed(() => {
    return typeof window.chrome.webview != 'undefined';
  });

  // functions
  const on = <T>(
    eventName: string,
    handler: (data: T, callback?: any) => Promise<void> | void
  ) => {
    // register listener
    listeners.value.push({
      id: randomId(),
      eventName,
      handler
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emit = (eventName: string, data: any) => {
    window.chrome.webview.postMessage(
      JSON.stringify({
        eventName,
        data: JSON.stringify(data)
      })
    );
  };

  const emitWithAck = (
    eventName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (data: any) => Promise<void> | void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ) => {
    const id = randomId();
    callbacks.value.push({ id, handler });
    window.chrome.webview.postMessage(
      JSON.stringify({
        id,
        eventName,
        data: JSON.stringify(data)
      })
    );
  };

  // lifecycle
  if (import.meta.client && enabled.value) {
    onMounted(() => {
      window.chrome.webview.addEventListener('message', (e) => onMessage(e));

      on(ElectronEventType.ready, (data) => {
        console.log('on ElectronEventType.ready', data);
      });

      emit(ElectronInvokeType.ready, { foo: 'emit' });
      emitWithAck(
        ElectronInvokeType.ready,
        (data) => {
          console.log('callback ElectronInvokeType.ready', data);
        },
        { foo: 'emitWithAck' }
      );
    });

    // onUnmounted(() => {
    //   window.chrome.webview.removeEventListener('message', onMessage);
    // });
  }

  // exports
  return {
    state,
    enabled,
    on,
    emit,
    emitWithAck
  };
});
