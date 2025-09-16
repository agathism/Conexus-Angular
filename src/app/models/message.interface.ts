export default interface Message {
  id: number
  content: string
  createdAt: string
  sender: {
    id: number
    name: string
    profilePicture: string
  }
  receiver: {
    id: number
    name: string
    profilePicture: string
  }
  updatedAt: string
}