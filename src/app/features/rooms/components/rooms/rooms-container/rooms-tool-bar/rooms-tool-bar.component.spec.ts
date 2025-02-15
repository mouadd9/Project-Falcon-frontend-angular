import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsToolBarComponent } from './rooms-tool-bar.component';

describe('RoomsToolBarComponent', () => {
  let component: RoomsToolBarComponent;
  let fixture: ComponentFixture<RoomsToolBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsToolBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
