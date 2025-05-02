<script lang="ts">
  import { onMount } from 'svelte';
  import TaskItem from './TaskItem.svelte';
  import type { Task, TaskPriority, TaskFilter } from '../lib/types';
  import { getTasks } from '../lib/actions';

  export let initialTasks: Task[] = [];
  export let priorities: TaskPriority[] = [];

  let tasks = initialTasks;
  let filteredTasks = tasks;
  let filter: TaskFilter = { priority: 'all', status: 'all' };
  let loading = false;
  let error = '';

  // Subscribe to custom event for filter changes
  function handleFilterChange(event: CustomEvent<TaskFilter>) {
    filter = event.detail;
    applyFilters();
  }

  // Subscribe to custom event for task deletion
  function handleTaskDeleted(event: CustomEvent<number>) {
    tasks = tasks.filter((task) => task.id !== event.detail);
    applyFilters();
  }

  // Subscribe to custom event for task updates
  function handleTaskUpdated(event: CustomEvent<Task>) {
    const index = tasks.findIndex((t) => t.id === event.detail.id);
    if (index !== -1) {
      tasks[index] = event.detail;
      tasks = [...tasks]; // Trigger reactivity
      applyFilters();
    }
  }

  // Subscribe to custom event for new task creation
  function handleTaskCreated(event: CustomEvent<Task>) {
    tasks = [event.detail, ...tasks];
    applyFilters();
  }

  // Apply filters to tasks
  function applyFilters() {
    filteredTasks = tasks.filter((task) => {
      const priorityMatch =
        filter.priority === 'all' || task.priority === filter.priority;
      const statusMatch =
        filter.status === 'all' ||
        (filter.status === 'completed' && task.completed) ||
        (filter.status === 'active' && !task.completed);

      return priorityMatch && statusMatch;
    });
  }

  // Refresh tasks from server
  async function refreshTasks() {
    loading = true;
    error = '';
    try {
      tasks = await getTasks();
      applyFilters();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load tasks';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    // Listen for custom events from other components
    window.addEventListener(
      'filterChange',
      handleFilterChange as EventListener
    );
    window.addEventListener('taskDeleted', handleTaskDeleted as EventListener);
    window.addEventListener('taskUpdated', handleTaskUpdated as EventListener);
    window.addEventListener('taskCreated', handleTaskCreated as EventListener);

    // Apply initial filters
    applyFilters();

    return () => {
      // Clean up event listeners
      window.removeEventListener(
        'filterChange',
        handleFilterChange as EventListener
      );
      window.removeEventListener(
        'taskDeleted',
        handleTaskDeleted as EventListener
      );
      window.removeEventListener(
        'taskUpdated',
        handleTaskUpdated as EventListener
      );
      window.removeEventListener(
        'taskCreated',
        handleTaskCreated as EventListener
      );
    };
  });
</script>

<div class="task-list">
  {#if loading}
    <div class="flex justify-center p-6">
      <div class="loader"></div>
    </div>
  {:else if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{error}</span>
      <button on:click={refreshTasks} class="text-blue-500 underline ml-4"
        >Try again</button
      >
    </div>
  {:else if filteredTasks.length === 0}
    <div class="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
      <p class="text-gray-500">
        No tasks found. {filter.priority !== 'all' || filter.status !== 'all'
          ? 'Try changing your filters or '
          : ''}Create a new task to get started!
      </p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each filteredTasks as task (task.id)}
        <TaskItem {task} {priorities} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
