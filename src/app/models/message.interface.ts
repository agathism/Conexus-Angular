import User from "./user.interface"

export default interface Message {
  id?: number
  content: string
  createdAt: string
  senderId: number
  currentUser: User
  otherUser: User
  updatedAt: string
}