import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListComponente } from './event-list.component';

describe('EventListComponente', () => {
  let component: EventListComponente;
  let fixture: ComponentFixture<EventListComponente>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventListComponente]
    });
    fixture = TestBed.createComponent(EventListComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
