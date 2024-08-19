interface IScript {
  id?: string;
  src: string;
  onLoaded?: Promise<void> | void;
  ensure?: () => Promise<boolean> | boolean;
}

export const useLoadJS = defineStore('useLoadJS', () => {
  const loadScript = async (e: IScript) => {
    const id = e.id || e.src.split('/')[e.src.split('/').length - 1];
    const ensure = async (resolve: any) => {
      if (e.ensure) {
        const result = await e.ensure();
        if (!result) {
          setTimeout(ensure, 50);
          return;
        }
      }
      resolve(true);
    };

    if (document.querySelector(`script#${id}`)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const element = document.createElement('script');
      element.setAttribute('id', id);
      element.setAttribute('src', e.src);

      element.onload = () => ensure(resolve);
      element.onerror = reject;
      document.body.appendChild(element);
    });
  };

  const load = async (scripts: IScript[], parallel?: boolean) => {
    if (parallel) {
      await Promise.all(scripts.map((e) => loadScript(e)));
    } else {
      for (const e of scripts) {
        await loadScript(e);
      }
    }
  };

  // exports
  return { load };
});
