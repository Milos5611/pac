<script>
  /** @type {{name: string, size?: number, class?: string}} */
  let {name, size = 44, class: className = ''} = $props();

  const initials = $derived(
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(part => part[0])
      // First and last initial only: "Ana Maria Petrović" -> "AP"
      .filter((_, i, all) => i === 0 || i === all.length - 1)
      .join('')
      .toUpperCase() || '?',
  );

  // Stable hue per name, so a person keeps the same colour everywhere
  const hue = $derived(
    [...name].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 360, 7),
  );
</script>

<span
  class="avatar {className}"
  style:--h={hue}
  style:width="{size}px"
  style:height="{size}px"
  style:font-size="{Math.round(size * 0.38)}px"
  aria-hidden="true">{initials}</span>

<style>
  .avatar {
    display: inline-grid;
    place-items: center;
    flex-shrink: 0;
    border-radius: 50%;
    background: hsl(var(--h) 85% 93%);
    color: hsl(var(--h) 55% 30%);
    font-weight: 700;
    letter-spacing: 0.02em;
    user-select: none;
  }

  @media (prefers-color-scheme: dark) {
    .avatar {
      background: hsl(var(--h) 35% 24%);
      color: hsl(var(--h) 85% 85%);
    }
  }
</style>
