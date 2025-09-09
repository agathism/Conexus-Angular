import { Component, inject } from '@angular/core';
import Conversation from '../../models/conversation.interface';
import { ConversationsService } from '../../services/conversations.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private conversationsService = inject(ConversationsService);
  conversations: Conversation[] = [];
  private messagesService = inject(MessagesService);
  messages: Conversation[] = [];

  ngOnInit(): void {
    this.loadConversations();
    // this.loadMessages();
  }

  private loadConversations(): void {
    this.conversationsService.getConversations().subscribe({
      next: (data) => {
        this.conversations = data;
        console.log('✅ Conversations chargées:', this.conversations);
      },
      error: (err) => {
        console.error('❌ Erreur Conversations API:', err);
      }
    });
  }

  // private loadMessages(): void {
  //   this.messagesService.getMessages().subscribe({
  //     next: (data) => {
  //       this.messages = data;
  //       console.log('✅ Messages chargés:', this.messages);
  //     },
  //     error: (err) => {
  //       console.error('❌ Erreur Messages API:', err);
  //     }
  //   });
  // }
}
