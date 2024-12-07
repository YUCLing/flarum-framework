import type Mithril from 'mithril';
import Component, { ComponentAttrs } from '../Component';
import Separator from '../components/Separator';
import classList from '../utils/classList';
import cloneVnode from '../utils/cloneVnode';

type ModdedVnodeAttrs = {
  itemClassName?: string;
  key?: string;
};

type ModdedTag = Mithril.Vnode['tag'] & {
  isListItem?: boolean;
  isActive?: (attrs: ComponentAttrs) => boolean;
};

type ModdedVnode = Mithril.Vnode<ModdedVnodeAttrs> & { itemName?: string; itemClassName?: string; tag: ModdedTag };

type ModdedChild = ModdedVnode | string | number | boolean | null | undefined;
type ModdedChildArray = ModdedChildren[];
type ModdedChildren = ModdedChild | ModdedChildArray;

/**
 * This type represents an element of a list returned by `ItemList.toArray()`,
 * coupled with some static properties used on various components.
 */
export type ModdedChildrenWithItemName = ModdedChildren & { itemName?: string };

function isVnode(item: ModdedChildren): item is Mithril.Vnode {
  return typeof item === 'object' && item !== null && 't' in item;
}

function isSeparator(item: ModdedChildren): boolean {
  return isVnode(item) && item.t === m.component(Separator);
}

function withoutUnnecessarySeparators(items: ModdedChildrenWithItemName[]): ModdedChildrenWithItemName[] {
  const newItems: ModdedChildrenWithItemName[] = [];
  let prevItem: ModdedChildren;

  items.filter(Boolean).forEach((item, i: number) => {
    if (!isSeparator(item) || (prevItem && !isSeparator(prevItem) && i !== items.length - 1)) {
      prevItem = item;
      newItems.push(item);
    }
  });

  return newItems;
}

/**
 * The `listItems` helper wraps an array of components in the provided tag,
 * stripping out any unnecessary `Separator` components.
 *
 * By default, this tag is an `<li>` tag, but this is customisable through the
 * second function parameter, `customTag`.
 */
export default function listItems<Attrs extends ComponentAttrs>(
  rawItems: ModdedChildrenWithItemName[],
  customTag: VnodeElementTag<Attrs> = 'li',
  attributes: Attrs = {} as Attrs
): Mithril.Vnode[] {
  const items = rawItems instanceof Array ? rawItems : [rawItems];
  const Tag = customTag;

  return withoutUnnecessarySeparators(items).map((item) => {
    const classes = [item.itemName && `item-${item.itemName}`];

    if (isVnode(item) && item.t.isListItem) {
      item.a = item.a || {};
      item.a.key = item.a.key || item.itemName;
      const key = item.a.key;

      return m.keyed([key], (key) => [
        key,
        item
      ]);
    }

    if (isVnode(item)) {
      classes.push(item.a?.itemClassName || item.itemClassName);

      if (item.t.isActive?.(item.a)) {
        classes.push('active');
      }
    }

    const key = (isVnode(item) && item?.a?.key) || item.itemName;
    const child = <Tag className={classList(classes)} {...attributes}>
      {cloneVnode(item)}
    </Tag>;

    return key ? m.keyed([key], (key) =>
    [
      key,
      child
    ]) : child;
  });
}
 