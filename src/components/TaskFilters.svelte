<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { TaskPriority, TaskFilter } from '../lib/types';

  export let priorities: TaskPriority[] = [];
  export let initialFilter: TaskFilter = { priority: 'all', status: 'all' };

  const dispatch = createEventDispatcher();
  let isMounted = false;
  let filter: TaskFilter = { ...initialFilter };

  // Apply filters when they change
  function applyFilters() {
    // Dispatch local event
    dispatch('filterChange', filter);

    // Dispatch global event for other components only if we're in the browser
    if (isMounted && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('filterChange', {
          detail: filter
        })
      );
    }
  }

  // Reset filters to initial state
  function resetFilters() {
    filter = { ...initialFilter };
    applyFilters();
  }

  // Use onMount to ensure we're in the browser
  onMount(() => {
    isMounted = true;
    // Initial application of filters in browser
    applyFilters();
  });

  // Watch for filter changes, but only apply if mounted
  $: if (isMounted) {
    filter, applyFilters();
  }
</script>

<div class="bg-white p-4 rounded-lg shadow-sm border">
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <label
        for="priorityFilter"
        class="block text-sm font-medium text-gray-700 mb-1">Priority</label
      >
      <select
        id="priorityFilter"
        bind:value={filter.priority}
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Priorities</option>
        {#each priorities as priority}
          <option value={priority}
            >{priority.charAt(0).toUpperCase() + priority.slice(1)}</option
          >
        {/each}
      </select>
    </div>

    <div>
      <label
        for="statusFilter"
        class="block text-sm font-medium text-gray-700 mb-1">Status</label
      >
      <select
        id="statusFilter"
        bind:value={filter.status}
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  </div>

  <div class="mt-4 flex justify-end">
    <button
      on:click={resetFilters}
      class="text-blue-600 hover:text-blue-800 text-sm font-medium"
    >
      Reset Filters
    </button>
  </div>
</div>
