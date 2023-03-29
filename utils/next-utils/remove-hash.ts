export const removeHash = () => {
  if (!history) {
    return
  }
  setTimeout(() => {
    history.replaceState(
      '',
      document.title,
      window.location.pathname + window.location.search
    )
  }, 10)
}
