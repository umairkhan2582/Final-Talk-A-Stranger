import VideoDisplay from '../VideoDisplay';

export default function VideoDisplayExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <VideoDisplay 
        username="Alex_92"
        className="aspect-[3/4] md:aspect-video"
      />
      <VideoDisplay 
        username="You"
        isLocalVideo
        className="aspect-[3/4] md:aspect-video"
      />
    </div>
  );
}
