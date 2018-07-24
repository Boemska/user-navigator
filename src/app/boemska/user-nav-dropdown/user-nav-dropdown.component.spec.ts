import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ClarityModule } from 'clarity-angular';
import { RouterTestingModule } from '@angular/router/testing';

import { UserNavDropdownComponent } from './user-nav-dropdown.component';
import { AdapterService } from '../adapter.service';
import { UserService } from '../user.service';

import * as adapterLogs from 'h54s/src/logs';

describe('UserNavDropdownComponent', () => {
  let component: UserNavDropdownComponent;
  let fixture: ComponentFixture<UserNavDropdownComponent>;

  let debugModeEl: DebugElement;
  let headerButtonEl: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ClarityModule.forChild(),
        RouterTestingModule
      ],
      declarations: [UserNavDropdownComponent],
      providers: [AdapterService, UserService]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserNavDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    debugModeEl = fixture.debugElement.query(By.css('#debug-toggle'));
    headerButtonEl = fixture.debugElement.query(By.css('.boemska-nav-dropdown > .dropdown-toggle'));
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 way data binding for debug mode', () => {
    expect(component.debugMode).toBe(true);
    debugModeEl.nativeElement.click();
    expect(component.debugMode).toBe(false);
  });

  it('should update debug mode on adapter service', inject([AdapterService], adapterService => {
    expect(component.debugMode).toBe(true);
    expect(adapterService.debugMode).toBe(true);
    expect(adapterService._adapter.debug).toBe(true);
    debugModeEl.nativeElement.click();
    expect(component.debugMode).toBe(false);
    expect(adapterService.debugMode).toBe(false);
    expect(adapterService._adapter.debug).toBe(false);
  }));

  it('should set user name', inject([AdapterService], async adapterService => {
    let username = 'user name';
    let headerButtonSpan = headerButtonEl.nativeElement.querySelector('span:first-child');
    spyOn(adapterService._adapter, 'call').and.callFake(function (program, tables, callback) {
      callback(null, {
        userInfo: [{
          USERNAME: username,
        }]
      });
    });

    expect(headerButtonSpan.textContent).toBe('Not logged in');

    await adapterService.call();

    fixture.detectChanges();
    expect(headerButtonSpan.textContent).toBe('user name');
  }));

  it('should have badge next to the user name with correct number', inject([AdapterService], async adapterService => {
    spyOn(adapterService._adapter, 'call').and.callFake(function (program, tables, callback) {
      callback(null, {});
    });

    // spies will just return some empty objects in arrays
    spyOn(adapterLogs.get, 'getDebugData').and.callFake(function () {
      return [{}, {}];
    });
    spyOn(adapterLogs.get, 'getFailedRequests').and.callFake(function () {
      return [{}, {}, {}];
    });

    let badges = headerButtonEl.nativeElement.querySelectorAll('span.badge');
    expect(badges.length).toBe(1);
    expect(badges[0]).toBeTruthy();
    expect(badges[0].classList.contains('hidden')).toBe(true);

    await adapterService.call();

    fixture.detectChanges();

    let badge = headerButtonEl.nativeElement.querySelector('span.badge');
    expect(badge.textContent).toBe('2');

    component.debugMode = false;
    fixture.detectChanges();
    // it's another dom element after debugMode change
    badge = headerButtonEl.nativeElement.querySelector('span.badge');
    expect(badge.textContent).toBe('3');
  }));

});
