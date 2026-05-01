import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  standalone: false,
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  users: User[] = [];
  loading = false;
  error = '';
  successMessage = '';
  searchTerm = '';
  selectedRole: User['role'] | 'ALL' = 'ALL';
  savingUserIds = new Set<number>();

  readonly roles: User['role'][] = ['ADMIN', 'INSTRUCTOR', 'LEARNER'];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.content || data; // Assuming Page<User> or User[]
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filteredUsers(): User[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.users.filter((user) => {
      const roleMatch = this.selectedRole === 'ALL' || user.role === this.selectedRole;
      if (!roleMatch) return false;

      if (!term) return true;
      const fullName = `${user.nom || ''} ${user.prenom || ''}`.toLowerCase();
      return (
        fullName.includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        String(user.id).includes(term)
      );
    });
  }

  countByRole(role: User['role']): number {
    return this.users.filter((user) => user.role === role).length;
  }

  fullName(user: User): string {
    const value = `${user.nom || ''} ${user.prenom || ''}`.trim();
    return value || 'No name';
  }

  roleLabel(role: User['role']): string {
    return role.charAt(0) + role.slice(1).toLowerCase();
  }

  roleBadgeClass(role: User['role']): string {
    return {
      ADMIN: 'role-badge role-badge--admin',
      INSTRUCTOR: 'role-badge role-badge--instructor',
      LEARNER: 'role-badge role-badge--learner'
    }[role];
  }

  isSaving(userId: number): boolean {
    return this.savingUserIds.has(userId);
  }

  updateRole(user: User, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value as User['role'];
    const previousRole = user.role;

    if (!newRole || newRole === previousRole) {
      target.value = previousRole;
      return;
    }

    this.error = '';
    this.successMessage = '';
    this.savingUserIds.add(user.id);

    this.userService.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole;
        this.successMessage = `Role updated for ${this.fullName(user)}.`;
        this.savingUserIds.delete(user.id);
      },
      error: (err) => {
        this.error = 'Failed to update role';
        user.role = previousRole;
        target.value = previousRole;
        this.savingUserIds.delete(user.id);
        console.error(err);
      }
    });
  }

}
