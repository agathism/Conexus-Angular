import { Component, inject, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages/messages.service';
import Message from '../../models/message.interface';
import { DatePipe } from '@angular/common';
import ConversationSummary from '../../models/conversationSummary.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/users/user-service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
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
  currentUser: any;

  // Pour envoyer un message il ne faut que le contenu. Toutes les autres prorpriétés sont pré-remplies
  constructor() {
      this.messageForm = this.formBuilder.group({
        content: ['', [Validators.required]]
      });
    }
  
  ngOnInit(): void {
    console.log('🚀 Initialisation du component conversations');
    this.currentUser = this.authService.getCurrentUserId();
    this.loadConversations();
  }

  // Je charge une conversation spécifique sur la page de présentation
  loadConversations(): void {
    console.log('🔄 Début du chargement des conversations...');
    this.isLoading = true;
    this.errorMessage = '';

    this.messagesService.getConversations().subscribe({
      next: (conversations) => {
        console.log('✅ Conversations reçues dans le component:', conversations);
        console.log('📊 Nombre de conversations:', conversations.length);
        this.conversations = conversations;
        this.isLoading = false;

        if (conversations.length === 0) {
          console.log('ℹ️ Aucune conversation trouvée');
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement:', err);
        this.handleError('Erreur lors du chargement des conversations', err);
      }
    });
  }

  /**
   * Sélectionne une conversation et charge ses messages
   */
  selectConversation(conversation: any) {
    this.selectedConversation = conversation;
    this.loadMessages(conversation.otherUser.id);
  }

  loadMessages(otherUserId: number): void {
    this.messagesService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        // Scroll vers le bas après chargement
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des messages:', error);
      }
    });
  }
  
  // Ferme la conversation (utile sur mobile)
  closeConversation() {
    this.selectedConversation = null;
    
  }

  
  // Scroll automatique vers le bas des messages
  private scrollToBottom() {
    const container = document.querySelector('#messagesContainer');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  // Gestion du responsive - masquer la liste sur mobile quand conversation active
  get showConversationList(): boolean {
    // Sur mobile, masquer la liste si une conversation est sélectionnée
    return window.innerWidth >= 768 || !this.selectedConversation;
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
