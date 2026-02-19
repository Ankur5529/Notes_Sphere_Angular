import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,   // since Angular 20 uses standalone
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss'  // <-- should be plural: styleUrls
})
export class LandingPage {}
