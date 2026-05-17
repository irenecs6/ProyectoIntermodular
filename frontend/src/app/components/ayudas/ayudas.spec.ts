import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ayudas } from './ayudas';

describe('Ayudas', () => {
  let component: Ayudas;
  let fixture: ComponentFixture<Ayudas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ayudas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ayudas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
