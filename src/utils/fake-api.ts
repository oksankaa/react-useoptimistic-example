export interface Message {
  id: string
  text: string
}

let fakeId = 1
export function getId(): number {
  return fakeId++
}

export function sendMessageToServer(
  text: string
): Promise<Message> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() < 0.5
      if (!success) {
        reject(new Error('Server exploded'))
      } else {
        resolve({
          id: getId().toString(),
          text,
        })
      }
    }, 1000)
  })
}
