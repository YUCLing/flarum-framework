import { app } from '..';
import Component from '../Component';
import bidi from './bidi';

/**
 * Create a function component from Component class.
 * @param {Component} comp
 * @returns
 */
function createComponentFunc(comp) {
  return function (attrs, old) {
    /** @type {Component} */
    const inst = (attrs.__component = old?.__component ?? new comp());
    const { children: mChildren, __component, ...compAttrs } = attrs;

    const vnodeAttrs = {
      attrs: compAttrs,
    };

    const isInit = !old?.__component;
    let beforeUpdateResult;

    inst.context = this;
    if (isInit) {
      inst.oninit(vnodeAttrs);
    } else {
      beforeUpdateResult = inst.onbeforeupdate({
        ...vnodeAttrs,
        dom: inst.element, // the dom must be existing since this is not the first time it got rendered.
      });
    }

    const children = [
      m.layout((dom) => {
        const vnodeDOMAttrs = {
          ...vnodeAttrs,
          dom,
        };
        if (isInit) {
          inst.oncreate(vnodeDOMAttrs);
          return;
        }
        if (beforeUpdateResult === false) {
          children.push(m.retain());
          return;
        }
        inst.onupdate(vnodeDOMAttrs);
      }),
      m.remove((dom) => {
        const vnodeDOMAttrs = {
          ...vnodeAttrs,
          dom,
        };
        inst.onbeforeremove(vnodeDOMAttrs); // todo: support delayed removal
        inst.onremove(vnodeDOMAttrs);
      }),
    ];
    return function () {
      const viewArgs = [
        {
          ...vnodeAttrs,
          children: mChildren,
        },
        old,
      ];
      const view = this.view(...viewArgs);
      return [...children, ...(Array.isArray(view) ? view : [view])];
    }.apply(inst);
  };
}

function Trust(attrs) {
  return [
    m.layout((dom) => {
      dom.innerHTML = attrs.html;
    }),
  ];
}

// from mithril, modified
const Link = () => {
  var href, opts, setRoute;
  var listener = (ev) => {
    if (
      !ev.defaultPrevented &&
      (ev.button === 0 || ev.which === 0 || ev.which === 1) &&
      (!ev.currentTarget.target || ev.currentTarget.target === '_self') &&
      !ev.ctrlKey &&
      !ev.metaKey &&
      !ev.shiftKey &&
      !ev.altKey
    ) {
      setRoute(href, opts);
      return m.capture(ev);
    }
  };

  return function (attrs, old) {
    setRoute = app.routing.set;
    href = attrs.h;
    opts = attrs.o;
    return [
      m.layout((dom) => {
        dom.href = app.routing.prefix + href;
        if (!old) dom.addEventListener('click', listener);
      }),
      m.remove((dom) => {
        dom.removeEventListener('click', listener);
      }),
    ];
  };
};

function getOrCreateComponentFunc(comp) {
  let func = componentFuncs.get(comp);
  if (!func) {
    componentFuncs.set(comp, (func = createComponentFunc(comp)));
    func.Component = comp;
  }
  return func;
}

const componentFuncs = new Map();

export default function patchMithril(global) {
  const defaultMithril = global.m;

  const modifiedMithril = function (comp, ...args) {
    const mArgs = [comp, ...args];

    if (comp === '__LINK__') {
      const attrs = args[0];
      return defaultMithril(
        'a',
        {
          className: attrs.className,
          class: attrs.class,
        },
        m(Link, { h: `${attrs.href}`, o: attrs.options }),
        args.slice(1)
      );
    }

    if (comp.prototype instanceof Component) {
      mArgs[0] = getOrCreateComponentFunc(comp);
    }

    const node = defaultMithril.apply(this, mArgs);

    if (!node.attrs) node.attrs = {};

    // Allows the use of the bidi attr.
    if (node.attrs.bidi) {
      bidi(node, node.attrs.bidi);
    }

    return node;
  };

  Object.keys(defaultMithril).forEach((key) => (modifiedMithril[key] = defaultMithril[key]));

  modifiedMithril.component = function (comp) {
    if (!comp.prototype instanceof Component) {
      throw 'Not a component';
    }
    return getOrCreateComponentFunc(comp);
  };

  modifiedMithril.route.param = function (k) {
    console.warn('m.route.param is not available in v3, falling back to managed routing');
    return app.routing.params[k];
  };

  modifiedMithril.route.get = function () {
    console.warn('m.route.get is not available in v3, falling back to managed routing');
    return app.routing.current;
  };

  modifiedMithril.route.set = function (link) {
    console.warn('m.route.set is not available in v3, falling back to managed routing');
    app.routing.set(link);
  };

  modifiedMithril.redraw = function () {
    console.warn('global redraw is not available in v3, using managed global redraw for now');
    app.redrawAll();
  };

  modifiedMithril.redraw.sync = function () {
    console.warn('global redraw is not available in v3, using managed global redraw for now');
    app.redrawAll(true);
  };

  modifiedMithril.trust = function (html) {
    return m(Trust, { html });
  };

  modifiedMithril.route.Link = '__LINK__';

  modifiedMithril.buildQueryString = defaultMithril.query;

  modifiedMithril.request = function (options) {
    const url = defaultMithril.p(options.url, options.params);
    delete options.url;
    delete options.params;
    return defaultMithril.fetch(url, options);
  };

  global.m = modifiedMithril;
}
