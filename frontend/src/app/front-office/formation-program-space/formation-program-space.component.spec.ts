import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationProgramSpaceComponent } from './formation-program-space.component';

describe('FormationProgramSpaceComponent', () => {
  let component: FormationProgramSpaceComponent;
  let fixture: ComponentFixture<FormationProgramSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationProgramSpaceComponent]
    });
    fixture = TestBed.createComponent(FormationProgramSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
