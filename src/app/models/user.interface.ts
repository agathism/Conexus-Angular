import Message from "./message.interface"
import Reservation from "./reservation.interface"
import Residence from "./residence.interface"
import Testimony from "./testimony.interface"

export default interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: string
  birthDate: string
  roles: string[]
  userGenre: string
  residences: Residence
  testimonies: Testimony
  reservations: Reservation
  messages: Message
  profilePicture: string
}
