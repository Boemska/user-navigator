import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavUsersComponent } from './nav-users.component';

describe('NavUsersComponent', () => {
  let component: NavUsersComponent;
  let fixture: ComponentFixture<NavUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
