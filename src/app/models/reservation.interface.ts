export default interface Reservation {
  id: number
  startDate: string
  endDate: string
  totalAmount: string
  createdAt: string
  amountPeople: string
  status: string
  room: {
    title: string
  }
  residence: {
    title: string
    city: string
    address: string
    imageUrl: string
    montlyPrice: string
  }
}