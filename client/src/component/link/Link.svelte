<script>
  import {navigate} from '../../lib/router.svelte.js';

  /** @type {{to: string, class?: string, children?: import('svelte').Snippet} & Record<string, any>} */
  let {to, class: className = '', children, ...rest} = $props();

  /** @param {MouseEvent} event */
  function onclick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }
</script>

<a href={to} class={className} {...rest} {onclick}>{@render children?.()}</a>
