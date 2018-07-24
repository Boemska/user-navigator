import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from 'clarity-angular';

import { ApplicationLogsComponent } from './application-logs.component';

describe('ApplicationLogsComponent', () => {
  let component: ApplicationLogsComponent;
  let fixture: ComponentFixture<ApplicationLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClarityModule
      ],
      declarations: [ ApplicationLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
