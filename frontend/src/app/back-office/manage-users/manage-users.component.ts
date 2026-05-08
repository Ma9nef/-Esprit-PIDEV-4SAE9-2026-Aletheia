import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  users: User[] = [];
  loading = false;
  error = '';

  roles = ['ADMIN', 'INSTRUCTOR', 'LEARNER'];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
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

  updateRole(user: User, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value;
    this.userService.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole as any;
      },
      error: (err) => {
        this.error = 'Failed to update role';
        console.error(err);
      }
    });
  }

}
