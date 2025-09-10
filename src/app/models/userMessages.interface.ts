import Message from "./message.interface";
import User from "./user.interface";

// Interface pour la réponse groupée
export default interface UserMessages {
    id: number
    content: string
    sender: User
    receiver: User
    createdAt: string
    updatedAt: string
    sent: Message[];
    received: Message[];
    all: Message[]; // Tous les messages triés par date
}