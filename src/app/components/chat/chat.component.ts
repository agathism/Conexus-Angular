import { Component, inject, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages/messages.service';
import Message from '../../models/message.interface';
import UserMessages from '../../models/userMessages.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
  private messagesService = inject(MessagesService);
  
  // Propriétés simplifiées
  messages: Message[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadMyMessages();
  }

  // Je charge tous mes messages
  loadMyMessages(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.messagesService.getMyMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Erreur lors du chargement des messages', err);
      }
    });
  }

  // Quand j'envoie un message
  sendMessage(receiverId: string, content: string): void {
    if (!content.trim()) {
      this.errorMessage = 'Le message ne peut pas être vide';
      return;
    }

    this.messagesService.sendMessage(receiverId, content).subscribe({
      next: (message) => {
        // J'ajoute directement le nouveau message (plus efficace que recharger tout)
        this.messages.unshift(message);
        console.log('Message envoyé:', message);
      },
      error: (err) => {
        this.handleError('Erreur lors de l\'envoi', err);
      }
    });
  }

  // Je charge mes messages envoyés seulement
  loadSentMessages(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.messagesService.getMySentMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Erreur lors du chargement des messages envoyés', err);
      }
    });
  }

  // Je charge mes messages reçus seulement
  loadReceivedMessages(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.messagesService.getMyReceivedMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Erreur lors du chargement des messages reçus', err);
      }
    });
  }

  // Je charge une conversation spécifique
  loadConversation(otherUserId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.messagesService.getConversation(otherUserId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Erreur lors du chargement de la conversation', err);
      }
    });
  }

  // Gestion d'erreur centralisée (il me permet d'éviter la duplication)
  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(error);
  }

  // Je nettoie le message d'erreur
  clearError(): void {
    this.errorMessage = '';
  }
}
