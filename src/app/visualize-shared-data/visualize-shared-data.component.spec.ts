import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeSharedDataComponent } from './visualize-shared-data.component';

describe('VisualizeSharedDataComponent', () => {
  let component: VisualizeSharedDataComponent;
  let fixture: ComponentFixture<VisualizeSharedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizeSharedDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizeSharedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
