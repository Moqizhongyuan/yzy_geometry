/* 加载图案的Promise对象 */
function ImagePromise(image: HTMLImageElement) {
  return new Promise<HTMLImageElement>(resolve => {
    image.onload = () => {
      resolve(image)
    }
  })
}

/* 图案的批量加载 */
function ImagePromises(images: HTMLImageElement[]) {
  return images.map(image => ImagePromise(image))
}

export { ImagePromise, ImagePromises }
