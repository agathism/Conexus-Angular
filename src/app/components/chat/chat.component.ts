import { Component, inject, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages/messages.service';
import Message from '../../models/message.interface';
import { DatePipe } from '@angular/common';
import ConversationSummary from '../../models/conversation.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/users/user-service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  private messagesService = inject(MessagesService);
  private authService = inject(UserService);
  messageForm: FormGroup;
  private formBuilder = inject(FormBuilder);

  // Propriétés simplifiées
  conversations: ConversationSummary[] = [];
  messages: Message[] = [];
  isLoading = false;
  selectedConversation: any = null;
  errorMessage = '';
  currentUser: any = null; // Initialisé explicitement

  constructor() {
    this.messageForm = this.formBuilder.group({
      content: ['', [Validators.required]]
    });
  }

  send() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      console.log('Envoi réussi !');
    }, 3000);
  }
  
  ngOnInit(): void {
    console.log('🚀 Initialisation du component conversations');
    this.loadCurrentUser(); // Charge l'utilisateur actuel
    this.loadConversations();
  }

  // Méthode pour charger l'utilisateur actuel
  private loadCurrentUser(): void {
    // Adaptez selon votre service d'authentification
    this.currentUser = this.authService.getCurrentUserId();
  }

  loadConversations(): void {
    console.log('🔄 Début du chargement des conversations...');
    this.errorMessage = '';
    this.isLoading = true;

    this.messagesService.getConversations().subscribe({
      next: (conversations) => {
        console.log( 'Conversations reçues dans le component:', conversations);
        console.log('📊 Nombre de conversations:', conversations.length);
        // vérification et nettoyage des données amélioré
        this.conversations = conversations.filter(conv => 
          conv && 
          conv.id && 
          conv.otherUser && 
          conv.otherUser.id
        );
        this.isLoading = false; 

        if (this.conversations.length === 0) {
          console.log('ℹ️ Aucune conversation trouvée');
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement:', err);
        this.handleError('Erreur lors du chargement des conversations', err);
      }
    });
  }

  selectConversation(conversation: any) {
    this.selectedConversation = conversation;
    this.loadMessages(conversation.otherUser.id);
  }

  loadMessages(otherUserId: number): void {
    this.isLoading = true;
    this.messages = []; // Réinitialiser les messages
    
    this.messagesService.getMessages(otherUserId).subscribe({
      next: (messages) => {
        this.messages = messages || []; // Fallback sur array vide
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        this.messages = []; // Réinitialiser en cas d'erreur
        this.handleError('Erreur lors du chargement des messages', error);
      }
    });
  }
  
  closeConversation() {
    this.selectedConversation = null;
    this.messages = []; // Vider les messages
  }

  private scrollToBottom() {
    const container = document.querySelector('#messagesContainer');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  get showConversationList(): boolean {
    return window.innerWidth >= 768 || !this.selectedConversation;
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(error);
  }

  clearError(): void {
    this.errorMessage = '';
  }

  // Méthode trackBy pour optimiser les performances
  trackByConversationId(index: number, conversation: ConversationSummary): any {
    return conversation?.id || index;
  }

  trackByMessageId(index: number, message: Message): any {
    return message?.id || index;
  }
}
