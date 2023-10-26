import { $fetch } from 'ofetch'

const registry = 'https://registry.npmjs.org'

export async function getMetadata (pkgName) {
    return $fetch(`${registry}/${pkgName}`, {
        method: 'GET',
    })
}

export async function getPackageNames (text) {
    return $fetch(`${registry}/-/v1/search?text=${text}`, {
        method: 'GET',
    })
}
