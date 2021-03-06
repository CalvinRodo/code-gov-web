import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Agency } from '../../../services/client';
import { ClientService } from '../../../services/client';
import { ExternalLinkDirective } from '../../../directives/external-link';
import { SeoService } from '../../../services/seo';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'repo',
  styles: [require('./repo.styles.scss')],
  template: require('./repo.template.html')
})

export class RepoComponent implements OnInit, OnDestroy {
  agency: Agency;
  repo: any;
  eventSub: Subscription;
  repoSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private seoService: SeoService,
    private readonly meta: MetaService
  ) {}

  ngOnInit() {
    this.eventSub = this.route.params.subscribe(params => {
      this.getRepo(params['agency_id'], params['id']);
    });
  }

  ngOnDestroy() {
    if (this.eventSub) this.eventSub.unsubscribe();
    if (this.repoSub) this.repoSub.unsubscribe();
  }

  getRepo(agencyId, releaseId) {
    this.clientService.getRepoByID(releaseId).subscribe(repo => {
      this.repo = repo;
      this.seoService.setTitle(this.repo.name, true);
      this.seoService.setMetaDescription(this.repo.description);
      this.seoService.setMetaRobots('Index, Follow');
      this.meta.setTag('twitter:card', 'summary');
      this.meta.setTag('twitter:site', '@codedotgov');
      this.meta.setTag('twitter:title', `code.gov/${this.repo.name}`);
      this.meta.setTag('twitter:description', this.repo.description);
      this.meta.setTag('twitter:image', 'https://code.gov/assets/img/og.jpg');
    });
  }

  getRepositoryUrl() {
    if (!this.repo.repositoryURL) return null;

    if (this.repo.repositoryURL.startsWith('git://')) {
      const matcher = /git:\/\/(.*?)\/(.*?)\/(.*?)\.git/;
      const matches = matcher.exec(this.repo.repositoryURL);
      return `https://${matches[1]}/${matches[2]}/${matches[3]}`;
    }

    return this.repo.repositoryURL;
  }
}
