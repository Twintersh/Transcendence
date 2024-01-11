import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpFormComponent } from './signup-form.component';

describe('SignUpFormComponent', () => {
  let component: SignUpFormComponent;
  let fixture: ComponentFixture<SignUpFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpFormComponent]
    });
    fixture = TestBed.createComponent(SignUpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
