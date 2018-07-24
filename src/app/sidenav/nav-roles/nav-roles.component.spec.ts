import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavRolesComponent } from './nav-roles.component';

describe('NavRolesComponent', () => {
  let component: NavRolesComponent;
  let fixture: ComponentFixture<NavRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
