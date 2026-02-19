import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  backendUrl = "http://localhost:5000";
  userId: string = '';
  userName: string = '';

  note = {
    title: '',
    description: '',
    file: null as File | null
  };

  myNotes: any[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object   // ✅ Inject platform info
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {   // ✅ Run only in browser
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userId = user.id || '';
      this.userName = user.name || user.email || 'User';

      if (!this.userId) {
        alert("User not logged in!");
        return;
      }

      this.loadMyNotes();
    }
  }

  // File input handler
  onFileSelected(event: any) {
    this.note.file = event.target.files[0];
  }

  // Upload note
  uploadNote() {
    if (!this.note.title || !this.note.file) {
      alert("Title and file are required");
      return;
    }

    const formData = new FormData();
    // formData.append('user_id', this.userId); // Backend uses session
    formData.append('title', this.note.title);
    formData.append('description', this.note.description);
    formData.append('file', this.note.file);

    this.http.post(`${this.backendUrl}/upload_note`, formData, { withCredentials: true }).subscribe({
      next: () => {
        alert('Note uploaded successfully!');
        this.note = { title: '', description: '', file: null };
        this.loadMyNotes();
      },
      error: err => {
        console.error(err);
        alert('Error uploading note');
      }
    });
  }

  // Load notes
  loadMyNotes() {
    // Backend uses session for user_id, remove user_id from URL
    this.http.get(`${this.backendUrl}/get_notes`, { withCredentials: true }).subscribe({
      next: (res: any) => this.myNotes = res,
      error: err => console.error("Error loading notes:", err)
    });
  }

  // Delete note
  deleteNote(note: any) {
    // Backend gets user_id from session, remove query param
    this.http.delete(`${this.backendUrl}/delete_note/${note.id}`, { withCredentials: true }).subscribe({
      next: () => {
        alert('Note deleted successfully');
        this.loadMyNotes();
      },
      error: err => {
        console.error(err);
        alert('Error deleting note');
      }
    });
  }

  // Open file
  viewNote(note: any) {
    if (note.file_url) {
      window.open(note.file_url, "_blank");
    }
  }

  // Logout
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get(`${this.backendUrl}/logout`, { withCredentials: true }).subscribe(() => {
        localStorage.removeItem('user');
        window.location.href = '/login';
      });
    }
  }
}
