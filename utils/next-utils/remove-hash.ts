export const removeHash = () => {
  if (!history) {
    return
  }
  history.replaceState(
    '',
    document.title,
    window.location.pathname + window.location.search
  )
}
