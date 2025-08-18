import { Topic } from "./topic.interface"

export interface Question {
  id: number
  title: string
  answerContent: string
  topic: Topic
}