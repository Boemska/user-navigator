import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from 'clarity-angular';

import { FailedRequestsComponent } from './failed-requests.component';

describe('FailedRequestsComponent', () => {
  let component: FailedRequestsComponent;
  let fixture: ComponentFixture<FailedRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClarityModule
      ],
      declarations: [ FailedRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
