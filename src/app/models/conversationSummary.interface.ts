export default interface ConversationSummary {
  id: number
  content: string
  otherUser: {
    id: number
    name: string
    profilePicture: string
  }
  updatedAt: string
}