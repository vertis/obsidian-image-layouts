<script>
  export let current = false;
</script>

<button
  type="button"
  class={`w-3 h-3 rounded-full ${current && "current"}`}
  aria-current={current ? "true" : "false"}
></button>

<style>
  button.current {
    background-color: #4b5563;
  }

  button {
    background-color: white;
  }
</style>
