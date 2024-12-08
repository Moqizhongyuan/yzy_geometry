export function supportsWebP() {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(img.width === 1) // WebP 支持时，宽度会是 1
    img.onerror = () => resolve(false) // 不支持 WebP
    img.src = 'data:image/webp;base64,UklGRiIAAABXRU5ErkJggg=='
  })
}
