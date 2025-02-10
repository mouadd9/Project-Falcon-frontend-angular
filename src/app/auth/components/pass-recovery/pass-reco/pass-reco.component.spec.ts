import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassRecoComponent } from './pass-reco.component';

describe('PassRecoComponent', () => {
  let component: PassRecoComponent;
  let fixture: ComponentFixture<PassRecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassRecoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassRecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
