import User from "./user.interface"

export default interface Residence {
  id: number
  title: string
  description: string
  address: string
  amountShowers: number
  monthlyPrice: number
  surface: number
  createdAt: string
  owner: User
  iconShower: string
  imageUrl: string
}