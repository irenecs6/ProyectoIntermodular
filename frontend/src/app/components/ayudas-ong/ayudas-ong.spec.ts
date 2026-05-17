import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudasONG } from './ayudas-ong';

describe('AyudasONG', () => {
  let component: AyudasONG;
  let fixture: ComponentFixture<AyudasONG>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyudasONG]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyudasONG);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
