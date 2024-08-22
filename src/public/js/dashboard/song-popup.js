const element = document.querySelector('#video')
const videoLink = element.getAttribute('link')
const id = getYouTubeVideoId(videoLink)

function onYouTubeIframeAPIReady () {
  const player = new YT.Player('video', {
    videoId: id,
    height: '310',
    width: '590',
    playerVars: {
      autoplay: 1,
      controls: 0
    }
  })
}

function getYouTubeVideoId (url) {
  const match = url.match(/[?&]v=([^&]*)/)
  return match && match[1]
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
