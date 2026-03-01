export async function XFetch(url: string, options: RequestInit){
    const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}