import Conversation from "./conversation.interface"
import User from "./user.interface"

export default interface Message {
  id: number
  content: string
  author: User
  conversation: Conversation
  createdAt: string
}