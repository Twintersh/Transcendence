import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueModalComponent } from './queue-modal.component';

describe('QueueModalComponent', () => {
  let component: QueueModalComponent;
  let fixture: ComponentFixture<QueueModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueueModalComponent]
    });
    fixture = TestBed.createComponent(QueueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
