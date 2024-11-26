import LinkButton from '../components/LinkButton';
import bidi from './bidi';

function isClass(x) {
  return typeof x === 'function' && x.prototype && !Object.getOwnPropertyDescriptor(x, 'prototype').writable;
}

function createComponentFunc(comp) {
  return function (attrs, old, context) {
      const inst = old?._cInst ?? new comp();
      inst.redraw = this.redraw;
      attrs._cInst = inst;

      const children = [
        m.init(() => {
          inst.__inited = true;
          if (inst.oninit) {
            const initVnode = {
              attrs: {...attrs}
            };
            delete initVnode.attrs._cInst;
            delete initVnode.attrs.children;
            inst.oninit.apply(inst, [initVnode]);
          }
        }),
        m.layout(function () {
          if (inst.setAttrs) {
            const setAttrs = {
              ...attrs
            };
            delete setAttrs._cInst;
            delete setAttrs.children;
            inst.setAttrs(setAttrs);
          }
          const layoutVnode = {
            attrs: {...attrs},
            dom: arguments[0]
          };
          delete layoutVnode.attrs._cInst;
          inst.oncreate.apply(inst, [layoutVnode]);
          if (inst.onupdate) {
            inst.onupdate.apply(inst, [layoutVnode]);
          }
        })
      ];
      if (inst.onremove) {
        children.push(m.remove(inst.onremove.bind(inst)));
      }
      return (function() {
        if (!this.__inited) return children;
        const viewAttrs = {...attrs};
        delete viewAttrs._cInst;
        const viewArgs = [{
          attrs: viewAttrs,
          ...viewAttrs
        }, old, context];
        const view = this.view(...viewArgs);
        if (comp == LinkButton) {
          view.t = 'a';
        }
        return [...children, view];
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

	var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m, key, variadic) {
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

const componentFuncs = new Map();

export default function patchMithril(global) {
  const defaultMithril = global.m;

  const modifiedMithril = function (comp, ...args) {
    const mArgs = [comp, ...args];

    if (comp === '__LINK__') {
      const attrs = args[0];
      const classes = (attrs.className ?? '').split(' ');
      console.log(args.slice(1));
      return defaultMithril('a' + classes.map((v) => '.' + v).join(), defaultMithril.link(attrs.href, attrs.options), args.slice(1));
    } else if (isClass(comp)) {
      let func = componentFuncs.get(comp);
      if (!func) {
        componentFuncs.set(comp, func = createComponentFunc(comp));
      }
      mArgs[0] = func;
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

  modifiedMithril.route.param = function() {
    console.warn('m.route.param is not available in v3');
    return '';
  }

  modifiedMithril.route.get = function() {
    console.warn('m.route.get is not available in v3');
    return '';
  }

  modifiedMithril.redraw = function() {
    console.warn('global redraw is not available in v3');
  }

  modifiedMithril.trust = function(html) {
    return m(Trust, { html });
  }

  modifiedMithril.route.Link = '__LINK__';

  modifiedMithril.buildQueryString = defaultMithril.query;

  modifiedMithril.request = function(options) {
    const url = buildPathname(options.url, options.params);
    delete options.url;
    delete options.params;
    return defaultMithril.fetch(url, options);
  };

  global.m = modifiedMithril;
}
