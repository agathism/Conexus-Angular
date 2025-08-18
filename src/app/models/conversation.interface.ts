import Message from "./message.interface"
import User from "./user.interface"

export default interface Conversation {
  id: number
  createdAt: string
  updatedAt: string
  messages: Message
  participants: User
}