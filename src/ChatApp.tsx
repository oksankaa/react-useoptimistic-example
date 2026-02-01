import { useState, useOptimistic, startTransition } from 'react'
import { sendMessageToServer } from './utils/fake-api'

export interface Message {
  id: string
  text: string
}

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    Message
  >(messages, (state, message) => [message, ...state])

  const sendMessage = async () => {
    if (!input.trim()) return

    startTransition(async () => {
      const text = input
      addOptimisticMessage({
        id: crypto.randomUUID(),
        text,
      })
      try {
        const sentMessage = await sendMessageToServer(text)
        setMessages([sentMessage, ...messages])
      } catch (err) {
        alert('Ups, something went wrong. Please send your message again.')
      }
    })
    setInput('')
  }

  return (
    <div>
      <form className="chat-input-container"  onSubmit={sendMessage}>
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message…"
        />
        <button className="chat-send-button" onClick={sendMessage}>
          Send
        </button>
      </form>
      <div className="chat-messages">
        {optimisticMessages.length > 0 && (
          <div>
            Optimistic:
            {optimisticMessages.map(msg => (
              <div className="message optimistic" key={msg.id}>
                {msg.text}
              </div>
            ))}
          </div>
        )}

        {messages.length > 0 && (
          <div>
            Confirmed:
            {messages.map(msg => (
              <div className="message server" key={msg.id}>
                {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
