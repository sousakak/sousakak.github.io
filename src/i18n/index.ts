import { FluentBundle, FluentResource } from "@fluent/bundle";
import type { FluentVariable } from "@fluent/bundle";

const localeSources = import.meta.glob<string>(
    "./locales/*.ftl",
    {
        query: "?raw",
        import: "default",
        eager: true
    }
);

function extractLocale( path: string ): string {
    const match = path.match( /([^/]+)\.ftl$/ );
    return match ? match[1] : path;
}

const bundles = new Map<string, FluentBundle>();

for ( const [ path, source ] of Object.entries( localeSources ) ) {

    const locale = extractLocale( path );

    const bundle = new FluentBundle( locale );
    bundle.addResource( new FluentResource( source ) );

    bundles.set( locale, bundle );

}

export function getTranslator( locale: string ) {

    const bundle = bundles.get( locale );

    return (
        id: string,
        args?: Record<string, FluentVariable>
    ): string => {

        if ( !bundle ) {
            return id;
        }

        const message = bundle.getMessage( id );

        if ( !message?.value ) {
            return id;
        }

        const errors: Error[] = [];
        return bundle.formatPattern( message.value, args, errors );

    };

}