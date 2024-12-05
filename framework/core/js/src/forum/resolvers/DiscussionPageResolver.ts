import type Mithril from 'mithril';

import app from '../../forum/app';
import DefaultResolver from '../../common/resolvers/DefaultResolver';
import DiscussionPage, { IDiscussionPageAttrs } from '../components/DiscussionPage';
import { RenderAttrs } from '../../common/Component';

/**
 * A custom route resolver for DiscussionPage that generates the same key to all posts
 * on the same discussion. It triggers a scroll when going from one post to another
 * in the same discussion.
 */
export default class DiscussionPageResolver<
  Attrs extends IDiscussionPageAttrs = IDiscussionPageAttrs,
  RouteArgs extends Record<string, unknown> = {}
> extends DefaultResolver<Attrs, DiscussionPage<Attrs>, RouteArgs> {
  static scrollToPostNumber: number | null = null;

  route: any;

  /**
   * Remove optional parts of a discussion's slug to keep the substring
   * that bijectively maps to a discussion object. By default this just
   * extracts the numerical ID from the slug. If a custom discussion
   * slugging driver is used, this may need to be overridden.
   * @param slug
   */
  canonicalizeDiscussionSlug(slug: string | undefined) {
    if (!slug) return;
    return slug.split('-')[0];
  }

  /**
   * @inheritdoc
   */
  makeKey() {
    const params = { ...this.route.params };
    if ('near' in params) {
      delete params.near;
    }
    params.id = this.canonicalizeDiscussionSlug(params.id);
    return this.routeName.replace('.near', '') + JSON.stringify(params);
  }

  onmatch(args: Attrs & RouteArgs, route: any) {
    this.route = route;

    if (app.current.matches(DiscussionPage) && this.canonicalizeDiscussionSlug(args.id) === this.canonicalizeDiscussionSlug(route.params.id)) {
      // By default, the first post number of any discussion is 1
      DiscussionPageResolver.scrollToPostNumber = args.near || 1;
    }

    return super.onmatch(args, route);
  }

  render(vnode: RenderAttrs<Attrs, DiscussionPage<Attrs>>) {
    if (DiscussionPageResolver.scrollToPostNumber !== null) {
      const number = DiscussionPageResolver.scrollToPostNumber;
      // Scroll after a timeout to avoid clashes with the render.
      setTimeout(() => app.current.get('stream').goToNumber(number));
      DiscussionPageResolver.scrollToPostNumber = null;
    }

    return super.render(vnode);
  }
}
