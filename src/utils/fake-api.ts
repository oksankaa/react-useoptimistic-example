export interface Message {
  id: string
  text: string
}

export function getId() {
  return Math.random().toString(36).substring(2, 6)
}

export function sendMessageToServer(
  text: string
): Promise<Message> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() < 0.5
      if (!success) {
        reject(new Error('Server exploded 💥'))
      } else {
        resolve({
          id: getId(),
          text,
        })
      }
    }, 1000)
  })
}
