import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavGroupsComponent } from './nav-groups.component';

describe('NavGroupsComponent', () => {
  let component: NavGroupsComponent;
  let fixture: ComponentFixture<NavGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
