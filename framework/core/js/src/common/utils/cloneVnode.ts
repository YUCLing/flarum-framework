export default function cloneVnode(vnode: any): any {
    if (Array.isArray(vnode)) return vnode.map((v) => cloneVnode(v));
    if (typeof vnode !== 'object' || vnode === null || !('m' in vnode)) return vnode;
    let children: any[] = [];
    if (Array.isArray(vnode.c)) {
        for (const i in (vnode.c as any[])) {
            children[i] = cloneVnode(vnode.c[i]);
        }
    }
    return {
        ...vnode,
        c: vnode.c ? children : vnode.c
    };
}