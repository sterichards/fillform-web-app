import {Component, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../_services/users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatSnackBar} from "@angular/material/snack-bar";

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
  userItem;
  roles;
  @ViewChild(MatSort, null) sort: MatSort;
  showConfirmDelete = [];

  displayedColumns = ['username', 'forename', 'surname', 'enabled', 'type', 'createdAt', 'edit', 'delete'];

  constructor(
    private usersService: UsersService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {

    this.route.data.subscribe(data => this.routeType = data.type);

    if (this.routeType === 'new') {
      this.userItem = {};
      this.usersService.getRoles().subscribe(roles => {
        this.roles = [];
        roles.forEach(role => {
          if (role.role !== 'ROLE_USER') {
            delete role.menuItems;
            this.roles.push(role);
          }
        });
      });
    }

    if (this.routeType === 'list') {
      this.usersService.getAll().subscribe((users) => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.sort = this.sort;
      });
    }

    if (this.routeType === 'edit') {
      this.usersService.getSingle(this.route.snapshot.paramMap.get('id')).subscribe((user) => {
        this.userItem = user;
        this.userItem.role = user.role.id;

        this.usersService.getRoles().subscribe(roles => {
          this.roles = [];
          roles.forEach(role => {
            if (role.role !== 'ROLE_USER') {
              delete role.menuItems;
              this.roles.push(role);
            }
          });
        });
      });
    }
  }

  onReset() {
    this.submitted = false;
  }

  onSubmit(form: NgForm) {
    if (this.routeType === 'new') {
      this.createUser(form);
    }

    if (this.routeType === 'edit') {
      this.updateUser(form);
    }
  }

  updateUser(form) {
    this.usersService.update(form, this.route.snapshot.paramMap.get('id')).subscribe(response => {
      this.snackBar.open(this.userItem.name + ' has been saved', '', {
        duration: 2000,
      });
      this.router.navigate(['/users']);
    });
  }

  createUser(form) {
    this.usersService.create(form).subscribe(response => {
      this.snackBar.open(this.userItem.name + ' has been created', '', {
        duration: 2000,
      });
      this.router.navigate(['/users']);
    });
  }

  deleteUser(element) {
    this.usersService.delete(element.username).subscribe(response => {

      // Remove row from table
      const index = this.dataSource.data.indexOf(element);
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();

      // Notification popup
      this.snackBar.open('User ' + element.username + ' removed', '', {
        duration: 2000,
      });
    });
  }

  goBack() {
    this.location.back();
  }
}
