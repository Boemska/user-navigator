import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from 'clarity-angular';

import { DebugLogsComponent } from './debug-logs.component';

describe('DebugLogsComponent', () => {
  let component: DebugLogsComponent;
  let fixture: ComponentFixture<DebugLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClarityModule
      ],
      declarations: [ DebugLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
