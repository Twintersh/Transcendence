import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinModalComponent } from './win-modal.component';

describe('WinModalComponent', () => {
  let component: WinModalComponent;
  let fixture: ComponentFixture<WinModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WinModalComponent]
    });
    fixture = TestBed.createComponent(WinModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
