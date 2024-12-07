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
    const inst = attrs.__component = old?.__component ?? new comp();
    const { children: mChildren, __component, ...compAttrs } = attrs;

    const vnodeAttrs = {
      attrs: compAttrs
    };
    
    const isInit = !old?.__component;
    let beforeUpdateResult;

    inst.context = this;
    if (isInit) {
      inst.oninit(vnodeAttrs);
    } else {
      beforeUpdateResult = inst.onbeforeupdate({
        ...vnodeAttrs,
        dom: inst.element // the dom must be existing since this is not the first time it got rendered.
      });
    }

    const children = [
      m.layout((dom) => {
        const vnodeDOMAttrs = {
          ...vnodeAttrs,
          dom
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
          dom
        };
        inst.onbeforeremove(vnodeDOMAttrs); // todo: support delayed removal
        inst.onremove(vnodeDOMAttrs);
      })
    ];
    return (function () {
      const viewArgs = [{
        ...vnodeAttrs,
        children: mChildren
      }, old];
      const view = this.view(...viewArgs);
      return [...children, ...(Array.isArray(view) ? view : [view])];
    }).apply(inst);
  }
}

function buildPathname(template, params) {
  if ((/:([^\/\.-]+)(\.{3})?:/).test(template)) {
    throw new SyntaxError("Template parameter names *must* be separated")
  }
  if (params == null) return template
  var queryIndex = template.indexOf("?")
  var hashIndex = template.indexOf("#")
  var queryEnd = hashIndex < 0 ? template.length : hashIndex
  var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
  var path = template.slice(0, pathEnd)
  var query = {}

  Object.assign(query, params)

  var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function (m, key, variadic) {
    delete query[key]
    // If no such parameter exists, don't interpolate it.
    if (params[key] == null) return m
    // Escape normal parameters, but not variadic ones.
    return variadic ? params[key] : encodeURIComponent(String(params[key]))
  })

  // In case the template substitution adds new query/hash parameters.
  var newQueryIndex = resolved.indexOf("?")
  var newHashIndex = resolved.indexOf("#")
  var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex
  var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex
  var result = resolved.slice(0, newPathEnd)

  if (queryIndex >= 0) result += template.slice(queryIndex, queryEnd)
  if (newQueryIndex >= 0) result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd)
  var querystring = m.query(query)
  if (querystring) result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring
  if (hashIndex >= 0) result += template.slice(hashIndex)
  if (newHashIndex >= 0) result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex)
  return result
}

function Trust(attrs) {
  return [
    m.layout((dom) => {
      dom.innerHTML = attrs.html
    })
  ];
}

function getOrCreateComponentFunc(comp) {
  let func = componentFuncs.get(comp);
  if (!func) {
    componentFuncs.set(comp, func = createComponentFunc(comp));
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
      const className = attrs.className ?? attrs.class ?? '';
      const classes = className != '' ? className.split(' ') : [];
      return defaultMithril(
        'a' + classes.map((v) => '.' + v).join(''),
        // this doesn't work since other roots won't have a router.
        /*defaultMithril.link(attrs.href, attrs.options)*/ { ...attrs, className: undefined, class: undefined },
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
  }

  modifiedMithril.route.param = function () {
    console.warn('m.route.param is not available in v3');
    return '';
  }

  modifiedMithril.route.get = function () {
    console.warn('m.route.get is not available in v3');
    return '';
  }

  modifiedMithril.redraw = function () {
    console.warn('global redraw is not available in v3, using managed global redraw for now');
    app.redrawAll();
  }

  modifiedMithril.redraw.sync = function() {
    console.warn('global redraw is not available in v3, using managed global redraw for now');
    app.redrawAll(true);
  }

  modifiedMithril.trust = function (html) {
    return m(Trust, { html });
  }

  modifiedMithril.route.Link = '__LINK__';

  modifiedMithril.buildQueryString = defaultMithril.query;

  modifiedMithril.request = function (options) {
    const url = buildPathname(options.url, options.params);
    delete options.url;
    delete options.params;
    return defaultMithril.fetch(url, options);
  };

  global.m = modifiedMithril;
}
