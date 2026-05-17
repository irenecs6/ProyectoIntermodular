import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDonante } from './registro-donante';

describe('RegistroDonante', () => {
  let component: RegistroDonante;
  let fixture: ComponentFixture<RegistroDonante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroDonante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroDonante);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
