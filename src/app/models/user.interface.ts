import Conversation from "./conversation.interface"
import Reservation from "./reservation.interface"
import Residence from "./residence.interface"
import Testimony from "./testimony.interface"

export default interface User {
  id: number
  name: string
  email: string
  createdAt: string
  birthDate: string
  userGenre: string
  residences: Residence
  testimonies: Testimony
  reservations: Reservation
  conversations: Conversation
  profilePicture: string
}