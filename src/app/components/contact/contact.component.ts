import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../../services/contacts/contacts.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  private formBuilder = inject(FormBuilder);
  private contactService = inject(ContactsService);

  constructor() {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  //  Passe les données au service
  monFormEstSoumis() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Récupère les données du formulaire
      const contactData = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message
      };

      console.log('📤 Données envoyées:', contactData); // DEBUG

      this.contactService.sendContact(contactData).subscribe({
        next: (response: any) => {
          console.log('✅ Succès:', response);
          this.successMessage = 'Message envoyé avec succès !';
          this.contactForm.reset(); // Vide le formulaire
          this.isSubmitting = false;
        },
        error: (err: any) => {
          console.error('❌ Erreur complète:', err);
          console.error('📋 Détails erreur:', err.error);
          
          this.isSubmitting = false;
          
          // Gestion des erreurs améliorée
          if (err.status === 422) {
            // Erreur de validation
            if (err.error && err.error.violations) {
              // Format Symfony
              const errors = err.error.violations.map((v: any) => v.message).join(', ');
              this.errorMessage = `Erreurs: ${errors}`;
            } else {
              this.errorMessage = 'Données invalides. Vérifiez vos informations.';
            }
          } else if (err.status === 0) {
            this.errorMessage = 'Impossible de contacter le serveur';
          } else {
            this.errorMessage = err.error?.message || 'Erreur lors de l\'envoi. Réessayez.';
          }
        }
      });
        }}
}
