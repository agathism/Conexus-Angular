import User from "./user.interface"

export default interface Message {
  id: number
  content: string
  sender: User
  receiver: User
  createdAt: string
  updatedAt: string
}