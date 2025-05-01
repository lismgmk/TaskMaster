<script lang="ts">
  import { onMount } from 'svelte';
  import type { Task, TaskPriority } from '../lib/types';
  import { updateTask, deleteTask } from '../lib/actions';
  
  export let task: Task;
  export let priorities: TaskPriority[] = [];
  
  let editedTask = { ...task };
  let loading = false;
  let error = '';
  let success = false;
  
  // Format date to readable string
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Get priority color class
  function getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Handle form submission
  async function handleSubmit() {
    loading = true;
    error = '';
    success = false;
    
    try {
      const updatedTask = await updateTask(task.id, editedTask);
      task = updatedTask;
      success = true;
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        success = false;
      }, 3000);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update task';
    } finally {
      loading = false;
    }
  }
  
  // Toggle task completed status
  async function toggleCompleted() {
    loading = true;
    error = '';
    
    try {
      const updatedTask = await updateTask(task.id, { 
        completed: !task.completed 
      });
      
      task = updatedTask;
      editedTask = { ...updatedTask };
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update task';
    } finally {
      loading = false;
    }
  }
  
  // Handle task deletion
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    loading = true;
    error = '';
    
    try {
      await deleteTask(task.id);
      window.location.href = '/';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to delete task';
      loading = false;
    }
  }
  
  // Update the editedTask when the task prop changes
  $: task, (editedTask = { ...task });
</script>

<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
  <div class="p-6">
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">{error}</span>
      </div>
    {/if}
    
    {#if success}
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">Task updated successfully!</span>
      </div>
    {/if}
    
    <div class="flex items-center mb-6">
      <input
        type="checkbox"
        checked={task.completed}
        on:change={toggleCompleted}
        class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        disabled={loading}
      />
      
      <span class="ml-3 text-sm font-medium text-gray-700">
        Mark as {task.completed ? 'incomplete' : 'complete'}
      </span>
      
      <div class="ml-auto">
        <button
          on:click={handleDelete}
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Task
        </button>
      </div>
    </div>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          type="text"
          bind:value={editedTask.title}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          bind:value={editedTask.description}
          rows="4"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            id="dueDate"
            type="date"
            bind:value={editedTask.dueDate}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            bind:value={editedTask.priority}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {#each priorities as priorityOption}
              <option value={priorityOption}>{priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}</option>
            {/each}
          </select>
        </div>
      </div>
      
      <div>
        <div class="flex items-center space-x-2">
          <span class={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
          
          <span class={`text-xs font-medium px-2.5 py-0.5 rounded-full ${task.completed ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {task.completed ? 'Completed' : 'In Progress'}
          </span>
          
          {#if task.dueDate}
            <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Due: {formatDate(task.dueDate)}
            </span>
          {/if}
        </div>
      </div>
      
      <div class="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
    
    <div class="mt-8">
      <h3 class="text-sm font-medium text-gray-500">Task Details</h3>
      <dl class="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
        <div class="py-3 flex justify-between text-sm">
          <dt class="text-gray-500">Created</dt>
          <dd class="text-gray-900 ml-6">
            {formatDate(task.createdAt)}
          </dd>
        </div>
        
        <div class="py-3 flex justify-between text-sm">
          <dt class="text-gray-500">Last Updated</dt>
          <dd class="text-gray-900 ml-6">
            {formatDate(task.updatedAt)}
          </dd>
        </div>
        
        <div class="py-3 flex justify-between text-sm">
          <dt class="text-gray-500">ID</dt>
          <dd class="text-gray-900 ml-6">
            {task.id}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</div>
