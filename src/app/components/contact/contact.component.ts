import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  // Déclaration du formulaire de contact
  contactForm: FormGroup;
  // Message d'erreur à afficher à l'utilisateur
  errorMessage = '';

  // Injection des services nécessaires
  private formBuilder = inject(FormBuilder);
  private contactService = inject(ContactsService);

  constructor() {
    // Initialisation du formulaire avec les champs et leurs validations
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  // Méthode appelée lors de la soumission du formulaire
  monFormEstSoumis() {
    if (this.contactForm.valid) {
      // Récupère toutes les données du formulaire
      const contactData = {
        name: this.contactForm.value.name,        
        email: this.contactForm.value.email,
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message
      };

      // Appel du service pour l'envoi du formulaire de contact
      this.contactService.sendContact().subscribe({
        next: (response: any) => {
          console.log('Envoi du formulaire réussie !', response);
        },
        error: (err: any) => {
          console.error('Erreur pour envoyer:', err);
          // Gestion des messages d'erreur
          if (err?.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Erreur lors de l\'envoi du formulaire. Veuillez réessayer.';
          }
        }
      });
    } else {
      // Affichage message si le formulaire n'est pas valide
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires.';
    }
  }
}
