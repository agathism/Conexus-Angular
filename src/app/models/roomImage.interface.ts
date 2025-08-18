import Room from "./room.interface"

export default interface RoomImage {
  id: number
  name: string
  imageUrl: string
  room: Room
}