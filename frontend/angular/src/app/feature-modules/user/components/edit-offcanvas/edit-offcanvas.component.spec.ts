import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOffcanvasComponent } from './edit-offcanvas.component';

describe('EditOffcanvasComponent', () => {
  let component: EditOffcanvasComponent;
  let fixture: ComponentFixture<EditOffcanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOffcanvasComponent]
    });
    fixture = TestBed.createComponent(EditOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
