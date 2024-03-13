<template>
  <div class="pagination-list">
    <ul class="pagination">
      <li
        v-for="pageNumber in pageNumbers"
        :key="pageNumber"
        class="page-item"
        :class="{ active: currentPage === pageNumber }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(pageNumber)">{{
          pageNumber
        }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ['pageChanged'],
  setup(props, { emit }) {
    const pageNumbers = computed(() => {
      const range = 4; // show 2 pages before and after current page
      const start = Math.max(props.currentPage - range, 1);
      const end = Math.min(props.currentPage + range, props.totalPages);
      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });

    function prevPage() {
      if (props.currentPage > 1) {
        emit('pageChanged', props.currentPage - 1);
      }
    }

    function nextPage() {
      if (props.currentPage < props.totalPages) {
        emit('pageChanged', props.currentPage + 1);
      }
    }

    function changePage(pageNumber) {
      emit('pageChanged', pageNumber);
    }

    return {
      pageNumbers,
      prevPage,
      nextPage,
      changePage,
    };
  },
});
</script>
