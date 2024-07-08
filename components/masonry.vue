<script setup lang="ts">
// define
const props = withDefaults(
  defineProps<{
    gridGap?: string;
    colWidth?: string;
  }>(),
  {
    gridGap: '0.5em',
    colWidth: 'minmax(Min(22.5em, 100%), 1fr)'
  }
);

// uses
const refreshLayoutDebounce = useDebounceFn(() => refreshLayout(), 150);

// states
const grids = ref<any[]>([]);
const masonryElement = ref<HTMLElement>();
const stretchFirst = ref(false);
const columnCount = ref(0);

// functions
const refreshLayout = async () => {
  grids.value.forEach(async (grid) => {
    const ncol = getComputedStyle(grid._el).gridTemplateColumns.split(
      ' '
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
        gap: parseFloat(getComputedStyle(grid).gridRowGap),
        items: [...grid.childNodes].filter((c) => {
          return (
            c.nodeType === 1 && +getComputedStyle(c as any).gridColumnEnd !== -1
          );
        }),
        ncol: 0,
        mod: 0
      };
    });
    refreshLayout();
  }
};

const initialize = () => {
  if (!masonryElement.value) {
    setTimeout(initialize, 50);
    return;
  }
  calcGrid([masonryElement.value]);
};

// lifecycle
onMounted(() => {
  initialize();
  window.addEventListener('resize', refreshLayoutDebounce, false);
});

onUnmounted(() => {
  window.removeEventListener('resize', refreshLayoutDebounce, false);
});
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

<style>
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, var(--col-width));
  grid-template-rows: masonry;
  justify-content: center;
  grid-gap: var(--grid-gap);
}

.masonry > * {
  align-self: start;
}

.masonry.stretch-first > *:first-child {
  grid-column: 1/ -1;
}
</style>
