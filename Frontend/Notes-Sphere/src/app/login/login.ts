import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const payload = { email: this.email, password: this.password };

    this.http.post('http://localhost:5000/login', payload, { withCredentials: true })
      .subscribe(
        (res: any) => {
          if (res.success) {
            alert(res.message);  // "Login successful"
            
            // ✅ optional: store user/session info
            if (res.user) {
              localStorage.setItem('user', JSON.stringify(res.user));
            }

            // ✅ navigate to dashboard instead of landing
            this.router.navigate(['/dashboard']);  
          } else {
            alert(res.message || 'Invalid email or password');
          }
        },
        (err) => {
          alert('Login failed: ' + (err.error?.message || err.message));
        }
      );
  }
}
