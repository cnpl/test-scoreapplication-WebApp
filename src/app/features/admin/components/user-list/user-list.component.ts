import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../../shared/models/user.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.users$ = this.adminService.getAllUsers();
  }
}
