import Residence from "./residence.interface"
import Room from "./room.interface"
import User from "./user.interface"

export default interface Reservation {
  id: number
  startDate: string
  endDate: string
  totalAmount: string
  createdAt: string
  amountPeople: string
  status: string
  user: User
  room: Room
  residence: Residence
}