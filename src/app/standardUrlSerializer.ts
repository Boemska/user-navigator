// StandardUrlSerializer
import { DefaultUrlSerializer, UrlSerializer, UrlTree } from "@angular/router";

export class StandardUrlSerializer implements UrlSerializer {
    private _defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

    parse(url: string): UrlTree {

       url = url.replace(/\(/g, "%28").replace(/\)/g, "%29");
       return this._defaultUrlSerializer.parse(url);
    }

    serialize(tree: UrlTree): string {

       return this._defaultUrlSerializer.serialize(tree);
    }
}
