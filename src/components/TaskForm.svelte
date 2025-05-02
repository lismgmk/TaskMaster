<script lang="ts">
  import { createTask, generateDescription } from '../lib/actions';
  import type { Task, TaskPriority } from '../lib/types';
  export const prerender = false;
  // Initialize form state
  let title = '';
  let description = '';
  let priority: TaskPriority = 'medium';
  let dueDate = '';

  let loading = false;
  let error = '';
  let success = false;

  // Available priorities
  const priorities: TaskPriority[] = ['low', 'medium', 'high'];

  // Reset form to initial state
  function resetForm() {
    title = '';
    description = '';
    priority = 'medium';
    dueDate = '';
    error = '';
  }

  // Handle form submission
  async function handleSubmit() {
    loading = true;
    error = '';
    success = false;

    if (!title.trim()) {
      error = 'Title is required';
      loading = false;
      return;
    }

    try {
      const newTask = await createTask({
        title,
        description,
        priority,
        dueDate: dueDate || undefined,
        completed: false
      });

      // Display success message
      success = true;

      // Reset form
      resetForm();

      // Dispatch custom event for parent components
      window.dispatchEvent(
        new CustomEvent('taskCreated', {
          detail: newTask
        })
      );

      // Clear success message after 3 seconds
      setTimeout(() => {
        success = false;
      }, 3000);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create task';
    } finally {
      loading = false;
    }
  }

  async function handleGenerate() {
    if (!title.trim()) return;
    loading = true;
    try {
      description = await generateDescription(title);
    } catch (err) {
      error =
        err instanceof Error ? err.message : 'Failed to generate description';
    } finally {
      loading = false;
    }
  }
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="bg-white p-6 rounded-lg shadow-sm border"
>
  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}

  {#if success}
    <div
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <span class="block sm:inline">Task created successfully!</span>
    </div>
  {/if}

  <div class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700"
        >Title *</label
      >
      <input
        id="title"
        type="text"
        bind:value={title}
        placeholder="What needs to be done?"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700"
        >Description</label
      >
      <textarea
        id="description"
        bind:value={description}
        placeholder="Add details about your task"
        rows="3"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label for="dueDate" class="block text-sm font-medium text-gray-700"
          >Due Date</label
        >
        <input
          id="dueDate"
          type="date"
          bind:value={dueDate}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label for="priority" class="block text-sm font-medium text-gray-700"
          >Priority</label
        >
        <select
          id="priority"
          bind:value={priority}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {#each priorities as priorityOption}
            <option value={priorityOption}
              >{priorityOption.charAt(0).toUpperCase() +
                priorityOption.slice(1)}</option
            >
          {/each}
        </select>
      </div>
    </div>

    <div class="flex justify-between">
      <button
        class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        on:click={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Description'}
      </button>
      <button
        type="submit"
        disabled={loading}
        class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </div>
  </div>
</form>
