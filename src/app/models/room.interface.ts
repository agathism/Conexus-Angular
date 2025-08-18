import RoomImage from "./roomImage.interface"

export default interface Room {
  id: number
  title: string
  description: string
  surface: string
  monthlyPrice: number
  roomImages: RoomImage
}