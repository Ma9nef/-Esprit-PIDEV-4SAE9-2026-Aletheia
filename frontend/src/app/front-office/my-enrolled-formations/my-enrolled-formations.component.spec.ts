import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEnrolledFormationsComponent } from './my-enrolled-formations.component';

describe('MyEnrolledFormationsComponent', () => {
  let component: MyEnrolledFormationsComponent;
  let fixture: ComponentFixture<MyEnrolledFormationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyEnrolledFormationsComponent]
    });
    fixture = TestBed.createComponent(MyEnrolledFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
