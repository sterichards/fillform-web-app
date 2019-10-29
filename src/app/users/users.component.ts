import {Component, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../_services/users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  submitted = false;
  hide = true;
  routeType;
  dataSource;
  @ViewChild(MatSort, null) sort: MatSort;
  newUserForm: FormGroup;

  displayedColumns = ['username', 'forename', 'surname', 'enabled', 'createdAt', 'edit'];

  constructor(
    private usersService: UsersService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute
  ) {
  }

  newUser = new FormControl('');

  ngOnInit() {

    this.usersService.getAll().subscribe((users) => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.sort = this.sort;
    });

    this.route.data.subscribe(data => this.routeType = data.type);

    this.newUserForm = this.fb.group({
      forename: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.required],
      company: ['', Validators.required],
      password: ['', Validators.required],
      passwordVerify: ['', Validators.required]
    });
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

  goBack() {
    this.location.back();
  }
}
