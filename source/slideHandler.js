/**
 * Created by shiyu on 18/3/16.
 */
// emit slides filepath to client
socketClient.emit("slidesPaths", socketClient.getCurrentGroup().presentation.getAllSlidesAsJSON());

// emit current slide
socketClient.emit("currentSlide", socketClient.getCurrentGroup().presentation.currentSlide);

socketClient.on('nextSlide', function() {
    socketClient.getCurrentGroup().presentation.nextSlide();
    socketClient.roomBroadcast("currentSlide", socketClient.getCurrentGroup().presentation.currentSlide);
});

socketClient.on('prevSlide', function() {
    socketClient.getCurrentGroup().presentation.previousSlide();
    socketClient.roomBroadcast("currentSlide", socketClient.getCurrentGroup().presentation.currentSlide);
});