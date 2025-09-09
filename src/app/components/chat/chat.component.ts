import { Component, inject } from '@angular/core';
import { MessagesService } from '../../services/messages/messages.service';
import Message from '../../models/message.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private messagesService = inject(MessagesService);
  messages: Message[] = [];

  ngOnInit(): void {
    this.loadMessages();
    // this.loadMessages();
  }

  private loadMessages(): void {
    this.messagesService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
        console.log('✅ Conversations chargées:', this.messages);
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
