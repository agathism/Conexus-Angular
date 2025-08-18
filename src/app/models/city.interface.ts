import Residence from "./residence.interface"

export default interface City {
  id: number
  name: string
  postalCode: number
  imageUrl: string
  description: string
  residences: Residence
}