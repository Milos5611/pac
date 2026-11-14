<script>
  import {navigate} from '../../lib/router.svelte.js';

  /** @type {{to: string, class?: string, title?: string, children?: import('svelte').Snippet}} */
  let {to, class: className = '', title, children} = $props();

  /** @param {MouseEvent} event */
  function onclick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }
</script>

<a href={to} class={className} {title} {onclick}>{@render children?.()}</a>
