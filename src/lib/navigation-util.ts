export const isActiveLink=(
    pathname:string,
    href:string,
    exact=false,
):boolean=>{
    const current=normalizePath(pathname);
    const target=normalizePath(href);

    if(exact)  return current===target;

    return current===target || current.startsWith(target+"/");


}


export const normalizePath = (url: string): string => {
    // Remove query parameters and hash
    const clean = url.split("?")[0].split("#")[0];

    // Remove trailing slash (except for root "/")
    if (clean.length > 1 && clean.endsWith("/")) {
        return clean.slice(0, -1);
    }

    return clean;
};
