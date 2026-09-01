import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRequest, AuthResponse } from '../models/auth.models';

/**
 * Service for managing JWT-based authentication.
 * Stores the token in localStorage for persistence across page reloads.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = '/api/auth';
  private readonly TOKEN_KEY = 'rpg_cloud_token';
  private readonly USERNAME_KEY = 'rpg_cloud_username';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /** Register a new user and store the JWT token */
  register(username: string, password: string): Observable<AuthResponse> {
    const body: AuthRequest = { username, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, body).pipe(
      tap(response => this.storeToken(response))
    );
  }

  /** Login and store the JWT token */
  login(username: string, password: string): Observable<AuthResponse> {
    const body: AuthRequest = { username, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body).pipe(
      tap(response => this.storeToken(response))
    );
  }

  /** Clear token and redirect to login */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    this.router.navigate(['/login']);
  }

  /** Get the stored JWT token */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Get the stored username */
  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  /** Check if the user is currently logged in */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }

  private storeToken(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USERNAME_KEY, response.username);
  }
}
