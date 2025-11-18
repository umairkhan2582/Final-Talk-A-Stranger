import LoadingScreen from '../LoadingScreen';

export default function LoadingScreenExample() {
  return (
    <div className="h-[400px] flex items-center justify-center">
      <LoadingScreen 
        message="Finding someone new..."
        tip="Be kind and respectful to make new friends!"
      />
    </div>
  );
}
