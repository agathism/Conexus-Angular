import { Topic } from "./topic.interface"

export default interface Question {
  id: number
  title: string
  answerContent: string
  topic: Topic
}