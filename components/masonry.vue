<script setup lang="ts">
// define
const props = withDefaults(
  defineProps<{
    gridGap?: string;
    colWidth?: string;
  }>(),
  {
    gridGap: '0.5em',
    colWidth: 'minmax(Min(22.5em, 100%), 1fr)',
  },
);

// uses
const device = useDevice();
const windowSize = useWindowSize();
const refreshLayoutDebounce = useDebounceFn(() => refreshLayout(), 150);

// states
const grids = ref<any>([]);
const masonryElement = ref<HTMLElement>();
const stretchFirst = ref(false);
const columnCount = ref(0);

// functions
const refreshLayout = async () => {
  grids.value.forEach(async (grid) => {
    const ncol = getComputedStyle(grid._el).gridTemplateColumns.split(
      ' ',
    ).length;
    columnCount.value = ncol;
    grid.items.forEach((c) => {
      const new_h = c.getBoundingClientRect().height;
      if (new_h !== +c.dataset.h) {
        c.dataset.h = new_h;
        grid.mod++;
      }
    });
    /* if the number of columns has changed */
    if (grid.ncol !== ncol || grid.mod) {
      /* update number of columns */
      grid.ncol = ncol;
      /* revert to initial positioning, no margin */
      grid.items.forEach((c) => c.style.removeProperty('margin-top'));
      /* if we have more than one column */
      if (grid.ncol > 1) {
        grid.items.slice(ncol).forEach((c, i) => {
          const prev_fin =
              grid.items[i].getBoundingClientRect()
                .bottom /* bottom edge of item above */,
            curr_ini =
              c.getBoundingClientRect().top; /* top edge of current item */
          c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`;
        });
      }
      grid.mod = 0;
    }
  });
};

const calcGrid = async (masonryElements: HTMLElement[]) => {
  if (
    masonryElements.length &&
    getComputedStyle(masonryElements[0]).gridTemplateRows !== 'masonry'
  ) {
    grids.value = masonryElements.map((grid) => {
      return {
        _el: grid,
        gap: parseFloat(getComputedStyle(grid).rowGap),
        items: [...grid.childNodes].filter((childNode) => {
          return (
            childNode.nodeType === 1 &&
            +getComputedStyle(childNode as HTMLElement).gridColumnEnd !== -1
          );
        }),
        ncol: 0,
        mod: 0,
      };
    });
    refreshLayout();
  }
};

const initialize = () => {
  if (!masonryElement.value) {
    setTimeout(initialize, 25);
    return;
  }
  calcGrid([masonryElement.value]);
  refreshLayout();
};

// changes
if (!device.isMobile) {
  watch(windowSize.width, refreshLayoutDebounce);
  watch(windowSize.height, refreshLayoutDebounce);
}

// lifecycle
if (!device.isMobile) {
  onNuxtReady(initialize);
}
</script>

<template>
  <div
    ref="masonryElement"
    :class="`masonry ${stretchFirst ? 'stretch-first' : ''}`"
    :style="`--grid-gap: ${props.gridGap}; --col-width: ${props.colWidth};`"
  >
    <slot :refresh-layout="refreshLayout" />
  </div>
</template>
