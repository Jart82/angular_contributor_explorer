import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorDetail } from './contributor-detail';

describe('ContributorDetail', () => {
  let component: ContributorDetail;
  let fixture: ComponentFixture<ContributorDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
