import Spinner from './spinner';

export default function Loader() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
