import Residence from "./residence.interface"
import User from "./user.interface"

export default interface Testimony
 {
  id: number
  note: number
  createdAt: string
  comment: string
  user: User
  residence: Residence
}