import {Component, OnInit} from '@angular/core';
import {UsersService} from '../_services/users.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  submitted = false;
  hide = true;
  users;
  newUserForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
  ) {
  }

  newUser = new FormControl('');

  ngOnInit() {

    if (this.router.url === '/users') {
      this.getUsers();
    }

    if (this.router.url === '/users/new') {
      this.newUserForm = this.fb.group({
        forename: ['', Validators.required],
        surname: ['', Validators.required],
        email: ['', Validators.required],
        company: ['', Validators.required],
        password: ['', Validators.required],
        passwordVerify: ['', Validators.required],
      });
    }
  }

  onReset() {
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;

    this.usersService.createUser(
      this.newUserForm.value.email,
      this.newUserForm.value.forename,
      this.newUserForm.value.surname,
      this.newUserForm.value.company,
      this.newUserForm.value.password,
    );

  }

  getUsers() {
    this.usersService.getAll().subscribe(res => this.users = res);
  }

  goBack() {
    this.location.back();
  }
}
