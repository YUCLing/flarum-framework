import type Mithril from 'mithril';
import type { AsyncNewComponent, NewComponent, RouteResolver } from '../Application';
import type { ComponentAttrs, RenderAttrs } from '../Component';
import Component from '../Component';
import LoadingIndicator from '../components/LoadingIndicator';
import { app } from '..';

/**
 * Generates a route resolver for a given component.
 *
 * In addition to regular route resolver functionality:
 * - It provide the current route name as an attr
 * - It sets a key on the component so a rerender will be triggered on route change.
 */
export default class DefaultResolver<
  Attrs extends ComponentAttrs,
  Comp extends Component<Attrs & { routeName: string }>,
  RouteArgs extends Record<string, unknown> = {}
> implements RouteResolver<Attrs, Comp, RouteArgs>
{
  component: NewComponent<Comp> | AsyncNewComponent<Comp>;
  routeName: string;
  params: RouteArgs = {} as RouteArgs;

  constructor(component: NewComponent<Comp> | AsyncNewComponent<Comp>, routeName: string) {
    this.component = component;
    this.routeName = routeName;
  }

  /**
   * When a route change results in a changed key, a full page
   * rerender occurs. This method can be overridden in subclasses
   * to prevent rerenders on some route changes.
   */
  makeKey(): string {
    return this.routeName + JSON.stringify(this.params);
  }

  makeAttrs(vnode: RenderAttrs<Attrs, Comp>): Attrs & { routeName: string } {
    return {
      ...vnode.attrs,
      routeName: this.routeName,
    };
  }

  async onmatch(args: RouteArgs, route: any): Promise<NewComponent<Comp>> {
    this.params = args;
    if (this.component.prototype instanceof Component) {
      return this.component as NewComponent<Comp>;
    }

    return (await (this.component as AsyncNewComponent<Comp>)()).default;
  }

  render(vnode: RenderAttrs<Attrs, Comp>) {
    let tag = this.component;
    if (typeof tag === 'function' && !('prototype' in tag)) {
      tag().then((comp) => {
        this.component = comp.default;
        app.redraw.app();
      });
      tag = LoadingIndicator;
    }
    return m.keyed([this.makeKey()], (key) => [
      key,
      m(tag, this.makeAttrs(vnode))
    ]);
  }
}
