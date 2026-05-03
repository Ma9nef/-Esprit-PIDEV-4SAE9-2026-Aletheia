import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationDetailComponent } from './formation-detail.component';

describe('FormationDetailComponent', () => {
  let component: FormationDetailComponent;
  let fixture: ComponentFixture<FormationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationDetailComponent]
    });
    fixture = TestBed.createComponent(FormationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
