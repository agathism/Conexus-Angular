import Residence from "./residence.interface"
import Room from "./room.interface"
import User from "./user.interface"

export default interface Indisponibility {
  id: number
  startDate: string
  endDate: string
  createdAt: string
  status: string
  ownerId: User
  residenceId: Residence
  roomId: Room
}