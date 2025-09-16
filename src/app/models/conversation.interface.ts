import User from "./user.interface"

export default interface Conversation {
  id: number
  content: string
  updatedAt: string
  otherUser: User
}