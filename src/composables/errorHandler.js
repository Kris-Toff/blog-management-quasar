import { useQuasar } from 'quasar'

export function useErrorHandler() {
  const $q = useQuasar()

  function showNotification(message, type = 'info') {
    let color = ''

    switch (type) {
      case 'success':
        color = 'green'
        break

      case 'error':
        color = 'red'
        break

      case 'warning':
        color = 'yellow'
        break

      default:
        color = 'primary'
        break
    }

    $q.notify({
      message: message,
      color: color,
    })
  }

  return { showNotification }
}
