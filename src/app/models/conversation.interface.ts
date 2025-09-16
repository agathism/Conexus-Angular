export default interface Conversation {
  id: number
  content: string
  updatedAt: string
  otherUser: {
    id: number
    name: string
    profilePicture: string
  }
}