/**
 * Enables flex resizing on a canvas element
 * @param canvas
 * @returns {() => void} A function to pass to a window resize event listener
 */
export default function flexCanvas(canvas: HTMLCanvasElement) {
  //Set onscreen canvas and its context
  // let onScreenCVS: HTMLCanvasElement = document.getElementById(
  //   "onScreen"
  // ) as HTMLCanvasElement;
  const onScreenCTX = canvas.getContext('2d')

  //Set initial size of canvas. If using a non-square, make sure to set the ratio the same as the offscreen canvas by multiplying either the height or width by the correct ratio.
  const rect = (canvas.parentNode as Element).getBoundingClientRect()
  const baseDimension = setSize(rect)

  canvas.width = baseDimension
  canvas.height = baseDimension

  const img = new Image()
  const source = canvas.toDataURL()

  //Once the image is loaded, draw the image onto the onscreen canvas.
  function renderImage(img: HTMLImageElement) {
    img.onload = () => {
      //if the image is being drawn due to resizing, reset the width and height. Putting the width and height outside the img.onload function will make scaling smoother, but the image will flicker as you scale. Pick your poison.
      canvas.width = baseDimension
      canvas.height = baseDimension
      //Prevent blurring
      onScreenCTX.imageSmoothingEnabled = false
      onScreenCTX.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    img.src = source
  }

  //Get the size of the parentNode which is subject to flexbox. Fit the square by making sure the dimensions are based on the smaller of the width and height.
  function setSize(rect) {
    return rect.height > rect.width ? rect.width : rect.height
  }

  //Resize the canvas if the window is resized
  function flexCanvasSize() {
    setSize(rect)
    renderImage(img)
  }

  return flexCanvasSize
}
