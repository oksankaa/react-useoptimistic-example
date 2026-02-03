import { useState, useOptimistic, startTransition } from 'react'
import { getId, sendMessageToServer, type Message } from './utils/fake-api'

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

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
        id: getId(),
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
        {messages.length > 0 && (
          <div>
            <div className="chat-description"> Messages confirmed by the server:</div>
              {messages.map(msg => (
                <div className="message server" key={msg.id}>
                  {msg.text} | id: {msg.id}
                </div>
              ))}
          </div>
        )}
        {optimisticMessages.length > 0 && (
          <div>
            <div className="chat-description">Messages shown optimistically (before server response):</div>
            {optimisticMessages.map(msg => (
              <div className="message optimistic" key={msg.id}>
                {msg.text} | id: {msg.id}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
