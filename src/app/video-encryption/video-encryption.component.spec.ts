import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEncryptionComponent } from './video-encryption.component';

describe('VideoEncryptionComponent', () => {
  let component: VideoEncryptionComponent;
  let fixture: ComponentFixture<VideoEncryptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEncryptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoEncryptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
