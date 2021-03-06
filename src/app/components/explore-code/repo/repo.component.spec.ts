import { Component } from '@angular/core';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { Angulartics2, Angulartics2Module } from 'angulartics2';
import { Observable } from 'rxjs/Observable';

import { ClientService } from '../../../services/client';
import { ExternalLinkDirective } from '../../../directives/external-link';
import { RepoComponent } from './index';
import { SeoService } from '../../../services/seo';
import { LanguageIconPipe } from './../../../pipes/language-icon/language-icon.pipe';
import { TruncatePipe } from './../../../pipes/truncate/truncate.pipe';
import { ModalComponent } from './../../modal/modal.component';
import { ActivityListComponent } from './../activity-list/activity-list.component';
import { ModalService } from './../../../services/modal/modal.service';
import { IsDefinedPipe } from './../../../pipes/is-defined/is-defined.pipe';
import { MetaModule, MetaService } from '@ngx-meta/core';

// set test repository id used throughout to Dept of Veterans Affairs
let id = '33202667';

/**
 * Mock route
 */
class MockActivatedRoute extends ActivatedRoute {
  constructor() {
    super();
    this.params = Observable.of({agency_id: 'VA', id: id});
  }
}

@Component({
  template: ''
})
class DummyRoutingComponent {
}

/**
 * Unit tests for RepoComponent.
 *
 */
describe('RepoComponent', () => {
  let fixture: ComponentFixture<RepoComponent>;
  let repoComponent: RepoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        Angulartics2Module.forRoot(),
        CommonModule,
        HttpModule,
        // This hack is needed because there is a routerLink in the template
        RouterTestingModule.withRoutes([
         { path: 'explore-code/agencies/:id', component: DummyRoutingComponent }
        ]),
        MetaModule.forRoot()
      ],
      declarations: [
        ExternalLinkDirective,
        LanguageIconPipe,
        TruncatePipe,
        ActivityListComponent,
        ModalComponent,
        RepoComponent,
        DummyRoutingComponent,
        IsDefinedPipe
      ],
      providers: [
        Angulartics2,
        ClientService,
        ModalService,
        SeoService,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    });

    fixture = TestBed.createComponent(RepoComponent);
    repoComponent = fixture.componentInstance;

  });

  /*
    There's no getJsonagency.id anymore
  it('should initialize repo property when getJsonagency.id property is set',
    inject([ClientService],
      (clientService)  => {
    // setup dependencies
    let agency = {
      'acronym': 'SBA',
      'name': 'Small Business Administration',
      'website': 'https://sba.gov/',
      'codeUrl': 'https://sba.gov/code.json',
      'numRepos': 5
    };
    spyOn(clientService, 'getAgencyByAcronym').and.returnValue(agency);
    let repo = createRepository({name: 'Fake repo name'});

    fixture.detectChanges();

    expect(repoComponent.repo).toBeDefined();
    // also checking on agency object after call to ClientService.getAgancy()
    expect(repoComponent.repo.agency.acronym).toEqual(agency.acronym);
    // console.log('Agency: ', repoComponent.repo.agency);
  }));
  */

  it('should NOT initialize repo property if id property is bogus',
    inject([ClientService, MetaService],
      (clientService, metaService)  => {
    let agency = { id: 'VA', name: 'Department of Veterans Affairs' };
    spyOn(clientService, 'getAgencyByAcronym').and.returnValue(agency);
    let repos = { releases: {} };
    // instantiate a new RepoComponent so that ngOnInit() doesn't get called
    let newRepoComponent = new RepoComponent(null, clientService, null, metaService);

    newRepoComponent.getRepo('VA', '');

    expect(newRepoComponent.repo).toBeUndefined();
  }));

  /*
    Need to rewrite this because now SEO is set after repo information
    is taken from API
  */
  /*
  it('should call seoService.setMetaDescription() when repository is returned ' ,
    inject([ClientService, SeoService], (clientService, seoService)  => {
      let agency = {id: 'VA', name: 'Department of Veterans Affairs'};
      spyOn(clientService, 'getAgencyByAcronym').and.returnValue(agency);
      let repo = createRepository({name: 'Another Fake repo name'});
      spyOn(seoService, 'setMetaDescription');
      fixture.detectChanges();

      expect(repoComponent.repo).toBeDefined();
      expect(seoService.setMetaDescription).toHaveBeenCalled();
    })
  );
  */

  /* Test repo.repository */
  // repo create happen asynchronously now after API call returns
  /*
  it('should display repository in template if repo.repositoryURL property is set',
    inject(
      [ClientService, SeoService],
      function (clientService, seoService) {
        const agency = { id: 'VA', name: 'Department of Veterans Affairs' };
        spyOn(clientService, 'getAgencyByAcronym').and.returnValue(agency);
        const repositoryURL = 'http://www.github.com/repository/';
        const repo = createRepository({
          name: 'A Fake repo name to show repo',
          repositoryURL: repositoryURL,
          homepageURL: 'http://code.gov/homepage/',
          permissions: {
            usageType: 'openSource'
          }
        });

        fixture.detectChanges();

        const anchors = fixture.nativeElement.querySelectorAll('.usa-button');

        // 2nd child anchor is the repository (first one is homepage)
        expect(anchors[1].href).toBe(repositoryURL);
      }
    )
  );
  */

  /*
  it('should display repository name in template if repo.name property is defined',
    inject([ClientService, SeoService],
      (clientService, seoService)  => {
        setupRepoPropertyTest(
          clientService,
          seoService,
          { name: 'VA REPO' }
        );

        fixture.detectChanges();

        let el = fixture.nativeElement.querySelector('h1');
        // expect name to be disolayed
        expect(el.textContent).toBeDefined();
      }
  ));
  */

  /*
    Need to rewrite because of new async loading of page
  */
  /*
  it('should display repository description in template if repo.description property is defined',
    inject([ClientService, SeoService],
      (clientService, seoService)  => {
        setupRepoPropertyTest(
          clientService,
          seoService,
          { description: 'REPO DESC' }
        );

        fixture.detectChanges();

        let div = fixture.nativeElement.querySelector('.repo-header-container');
        expect(div.children[2]).toBeDefined();
      }
  ));
  */

  /* Test repo.homepage */
  it('should NOT display repository homepage in template if repo.homepageURL property is undefined',
    inject([ClientService, SeoService],
      (clientService, seoService)  => {
        setupRepoPropertyTest(
          clientService,
          seoService,
          { homepageURL: undefined }
        );


        fixture.detectChanges();

        let anchors = fixture.nativeElement.querySelectorAll('.usa-unstyled-list .usa-button');
        expect(anchors[0]).toBeUndefined();
      }
  ));

  it('should NOT display repository homepage in template if repo.homepageURL property is null ',
    inject([ClientService, SeoService],
      (clientService, seoService)  => {
        setupRepoPropertyTest(
          clientService,
          seoService,
          { homepageURL: null }
        );

        fixture.detectChanges();

        let anchors = fixture.nativeElement.querySelectorAll('.usa-unstyled-list .usa-button');
        expect(anchors[0]).toBeUndefined();
      }
  ));

  it('should display repository homepage in template if repo.homepageURL property is defined',
    inject(
      [ClientService, SeoService],
      function (clientService, seoService) {
        setupRepoPropertyTest(
          clientService,
          seoService,
          { homepageURL: 'http://code.gov/', permissions: { usageType: 'openSource' } }
        );

        fixture.detectChanges();

        const parent = fixture.nativeElement.querySelectorAll('.usa-unstyled-list .usa-button');

        expect(parent).toBeDefined();
      }
    )
  );

  describe('ngOnDestroy()', () => {
    it('should unsubscribe from router event subscription on destroy', () => {
      fixture.detectChanges();
      spyOn(repoComponent.eventSub, 'unsubscribe');
      fixture.destroy();
      expect(repoComponent.eventSub.unsubscribe).toHaveBeenCalled();
    });
  });

});

/**
 * Interface for repository properties that we are testing.
 * All properties are optional since we are teasting each one in isolation.
 */
interface RepoProps {
  name?: string;
  description?: string;
  homepageURL?: string;

  repositoryURL?: string;
  openSourceProject?: number;
  governmentWideReuseProject?: number;
  permissions?: {
    usageType: string
  };
}

/**
 *  Creates and populate a repository object for use in tests
 * using the RepoProps interface for type safety.
 */
export function createRepository(repoProps: RepoProps) {
  return {
      releases: {
        ['VA/' + id]: {
          id : id,
          name: repoProps.name,
          description: repoProps.description,
          languages: [ 'JavaScript' ],
          agency: 'VA',
          homepageURL: repoProps.homepageURL,
          repositoryURL: repoProps.repositoryURL,
          permissions: {
            usageType: 'openSource',
            licenses: [{
              name: 'CCO',
              URL: 'http://www.example.com',
            }],
          },
        }
      }
    };
}

/**
 * Sets up a test of repository properties, by creating agency
 * and repostory data structures in addition to mocking
 * RepoComponent dependencies.
 */
export function setupRepoPropertyTest(
  clientService: ClientService,
  seoService: SeoService,
  repoProps: RepoProps,
) {
  let agency = { id: 'VA', name: 'Department of Veterans Affairs' };
  spyOn(clientService, 'getAgencyByAcronym').and.returnValue(agency);
  // set up repository
  const FAKE_REPO = createRepository(repoProps);
}
