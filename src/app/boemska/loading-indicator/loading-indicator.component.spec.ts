import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ClarityModule } from 'clarity-angular';

import { LoadingIndicatorComponent } from './loading-indicator.component';
import { AdapterService } from '../adapter.service';
import { UserService } from '../user.service';

describe('LoadingIndicatorComponent', () => {
  let component: LoadingIndicatorComponent;
  let fixture: ComponentFixture<LoadingIndicatorComponent>;

  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule.forChild()],
      declarations: [LoadingIndicatorComponent],
      providers: [AdapterService, UserService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(compiled).toBeTruthy();
  });

  it('should not be displayed by default', () => {
    expect(compiled.querySelector(".loading-indicator .spinner").style.display).toMatch('none');
  });

  it('should show/hide and hold the list of the requests', done => {
    inject([AdapterService], (adapterService) => {
      spyOn(adapterService._adapter, 'call').and.callFake(function(program, tables, callback) {
        setTimeout(callback, Math.round(Math.random() * 100));
      });
      const promise1 = adapterService.call('p1', null);
      const promise2 = adapterService.call('p2', null);
      fixture.detectChanges();

      expect(component.loading).toBe(true);
      expect(component.requests.length).toBe(2);
      expect(component.requests[0].running).toBe(true);
      expect(compiled.querySelector(".loading-indicator .spinner").style.display).toMatch('block');
      expect(compiled.querySelector(".loading-indicator clr-icon").style.display).toMatch('none');

      Promise.all([promise1, promise2]).then(() => {
        fixture.detectChanges();
        expect(component.loading).toBe(false);
        expect(component.requests.length).toBe(2);
        expect(component.requests[0].running).toBe(false);
        expect(compiled.querySelector(".loading-indicator .spinner").style.display).toMatch('none');
        expect(compiled.querySelector(".loading-indicator clr-icon").style.display).toMatch('block');
        done();
      })
    })();
  });
});
