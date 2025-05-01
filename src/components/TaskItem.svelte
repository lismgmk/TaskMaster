<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Task, TaskPriority } from '../lib/types';
  import { updateTask, deleteTask } from '../lib/actions';

  export let task: Task;
  export let priorities: TaskPriority[] = [];
  
  const dispatch = createEventDispatcher();
  
  let loading = false;
  let error = '';
  let isEditing = false;
  let editedTask = { ...task };
  
  // Get priority color class
  function getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Format date to readable string
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
      
      // Dispatch custom event for parent components
      window.dispatchEvent(new CustomEvent('taskUpdated', { 
        detail: updatedTask 
      }));
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
      
      // Dispatch custom event for parent components
      window.dispatchEvent(new CustomEvent('taskDeleted', { 
        detail: task.id 
      }));
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to delete task';
    } finally {
      loading = false;
    }
  }
  
  // Start editing mode
  function startEditing() {
    editedTask = { ...task };
    isEditing = true;
  }
  
  // Cancel editing mode
  function cancelEditing() {
    isEditing = false;
  }
  
  // Save edited task
  async function saveEdits() {
    loading = true;
    error = '';
    
    try {
      const updatedTask = await updateTask(task.id, editedTask);
      task = updatedTask;
      isEditing = false;
      
      // Dispatch custom event for parent components
      window.dispatchEvent(new CustomEvent('taskUpdated', { 
        detail: updatedTask 
      }));
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update task';
    } finally {
      loading = false;
    }
  }
</script>

<div class="border rounded-lg p-4 shadow-sm bg-white relative {loading ? 'opacity-70' : ''}">
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}
  
  {#if isEditing}
    <!-- Edit Form -->
    <div class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          bind:value={editedTask.title}
        />
      </div>
      
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows="2"
          bind:value={editedTask.description}
        ></textarea>
      </div>
      
      <div>
        <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          id="dueDate"
          type="date"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          bind:value={editedTask.dueDate}
        />
      </div>
      
      <div>
        <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          bind:value={editedTask.priority}
        >
          {#each priorities as priority}
            <option value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
          {/each}
        </select>
      </div>
      
      <div class="flex space-x-2 justify-end">
        <button
          on:click={cancelEditing}
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          on:click={saveEdits}
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  {:else}
    <!-- View mode -->
    <div class="flex items-start">
      <input
        type="checkbox"
        checked={task.completed}
        on:change={toggleCompleted}
        class="h-5 w-5 text-blue-600 border-gray-300 rounded mt-1 focus:ring-blue-500"
        disabled={loading}
      />
      
      <div class="ml-3 flex-grow">
        <a href={`/tasks/${task.id}`} class="inline-block">
          <h3 class="text-lg font-medium text-gray-900 {task.completed ? 'line-through text-gray-500' : ''}">
            {task.title}
          </h3>
        </a>
        
        <p class="mt-1 text-gray-600 {task.completed ? 'line-through text-gray-400' : ''}">
          {task.description || 'No description'}
        </p>
        
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span class="text-sm text-gray-500">
            Due: {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
          </span>
          
          <span class={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          
          <span class={`text-xs font-medium px-2.5 py-0.5 rounded-full ${task.completed ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {task.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>
      </div>
      
      <div class="flex space-x-2 ml-4">
        <button
          on:click={startEditing}
          class="text-blue-600 hover:text-blue-800"
          disabled={loading}
          aria-label="Edit task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button
          on:click={handleDelete}
          class="text-red-600 hover:text-red-800"
          disabled={loading}
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  {/if}
  
  {#if loading && !isEditing}
    <div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg">
      <div class="w-5 h-5 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
  {/if}
</div>
