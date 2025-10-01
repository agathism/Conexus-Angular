import { Component, inject, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages/messages.service';
import Message from '../../models/message.interface';
import { DatePipe} from '@angular/common';
import ConversationSummary from '../../models/conversation.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/users/user-service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
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
  successMessage = '';
  isSubmitting = false;
  currentUser: any = null; // Initialisé explicitement
  otherUserId: number | null = null;

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
    }, 2000);
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
    this.otherUserId = conversation.otherUser.id;
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

  // ← MÉTHODE CORRIGÉE
  myFormIsSubmitted() {
    console.log('📝 Soumission du formulaire...');
    
    // Vérifier qu'une conversation est sélectionnée
    if (!this.otherUserId) {
      console.error('❌ Aucune conversation sélectionnée');
      this.errorMessage = 'Veuillez sélectionner une conversation avant d\'envoyer un message.';
      return;
    }

    // Validation du formulaire (seulement le contenu)
    const contentControl = this.messageForm.get('content');
    if (!contentControl?.valid || !contentControl.value?.trim()) {
      console.warn('⚠️ Contenu du message invalide');
      this.errorMessage = 'Veuillez saisir un message.';
      contentControl?.markAsTouched();
      return;
    }
    console.log('✅ Formulaire valide');

    // Initialisation des états
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    console.log('🔄 États initialisés');

    // Récupération du contenu (otherUserId vient de currentOtherUserId)
    const content = contentControl.value.trim();
    console.log('📋 Données à envoyer:', { 
      content, 
      otherUserId: this.otherUserId,
      conversation: this.selectedConversation?.otherUser?.name 
    });

    // Envoi du message avec l'ID stocké
    console.log('🚀 Envoi du message...');
    this.messagesService.sendMessage(content, this.otherUserId).subscribe({
      next: (response: any) => {
        console.log('✅ Succès:', response);
        this.successMessage = 'Message envoyé avec succès !';
        
        // Reset seulement le contenu du message
        this.messageForm.get('content')?.reset();
        
        // Recharger les messages pour afficher le nouveau message
        this.loadMessages(this.otherUserId!);
        
        this.isSubmitting = false;
      },
      error: (err: any) => {
        console.error('❌ Erreur complète:', err);
        console.error('📋 Détails erreur:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        
        this.isSubmitting = false;
        this.errorMessage = this.getErrorMessage(err);
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

  /**
 * Méthode auxiliaire pour gérer les messages d'erreur
 */
  private getErrorMessage(err: any): string {
    // Erreur de validation (422)
    if (err.status === 422) {
      if (err.error?.violations) {
        // Format Symfony
        const errors = err.error.violations
          .map((violation: any) => violation.message)
          .join(', ');
        return `Erreurs de validation: ${errors}`;
      }
      return 'Données invalides. Vérifiez vos informations.';
    }
    
    // Erreur de connexion
    if (err.status === 0) {
      return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    }
    
    // Erreur d'authentification
    if (err.status === 401) {
      return 'Session expirée. Veuillez vous reconnecter.';
    }
    
    // Erreur de permission
    if (err.status === 403) {
      return 'Vous n\'avez pas l\'autorisation d\'effectuer cette action.';
    }
    
    // Erreur serveur
    if (err.status >= 500) {
      return 'Erreur serveur. Veuillez réessayer plus tard.';
    }
    
    // Erreur générique
    return err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
  }
}
