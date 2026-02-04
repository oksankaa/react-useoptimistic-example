import { useState, useOptimistic, startTransition } from 'react'
import { getId, sendMessageToServer, type Message } from './utils/fake-api'

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    Message
  >(messages, (state, message) => [message, ...state])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) {
      return
    }

    startTransition(async () => {
      addOptimisticMessage({
        id: `generated-${getId()}`,
        text,
      })
      try {
        const sentMessage = await sendMessageToServer(text)
        setMessages([sentMessage, ...messages])
      } catch (err) {
        setError('Ups, something went wrong. Please send your message again.')
        setTimeout(() => {
          setError('')
        }, 3000)
      }
    })
    setInput('')
  }

  return (
    <div>
      <form className="chat-input-container" action={sendMessage}>
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message…"
        />
        <button className="chat-send-button" type="submit">
          Send
        </button>
      </form>
      <div className="chat-messages">
        <div className="message-section">
          Messages confirmed by the server:
          {error && <div className="error-label">{error}</div>}
          {messages.map(msg => (
            <div className="message server" key={msg.id}>
              {msg.text} | id: {msg.id}
            </div>
          ))}
        </div>
        Messages shown optimistically (before server response):
          {optimisticMessages.map(msg => (
            <div className="message optimistic" key={msg.id}>
              {msg.text} | id: {msg.id}
            </div>
          ))}
      </div>
    </div>
  )
}

