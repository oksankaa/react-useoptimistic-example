export function sendMessageToServer(
  text: string
): Promise<{ id: string text: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() < 0.5
      if (!success) {
        reject(new Error('Server exploded 💥'))
      } else {
        resolve({
          id: crypto.randomUUID(),
          text,
        })
      }
    }, 1000)
  })
}

