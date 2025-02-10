import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBannerSubNavComponent } from './profile-banner-sub-nav.component';

describe('ProfileBannerSubNavComponent', () => {
  let component: ProfileBannerSubNavComponent;
  let fixture: ComponentFixture<ProfileBannerSubNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileBannerSubNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileBannerSubNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
