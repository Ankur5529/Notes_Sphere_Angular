// src/app/signup/signup.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onSignup() {
    // Prepare payload for Flask API
    const payload = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    // Send POST request to Flask backend
    this.http.post('http://localhost:5000/signup', payload)
      .subscribe(
        (res: any) => {
          alert(res.message);  // Show success message
          // Optional: Redirect to login page
          // this.router.navigate(['/login']);
        },
        (err) => {
          alert(err.error.message || 'Signup failed');  // Show error from backend
        }
      );
  }
}
