import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsBannerComponent } from './rooms-banner.component';

describe('RoomsBannerComponent', () => {
  let component: RoomsBannerComponent;
  let fixture: ComponentFixture<RoomsBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
