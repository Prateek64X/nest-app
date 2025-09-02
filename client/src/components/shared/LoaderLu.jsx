import { ClipLoader } from "react-spinners";

export default function LoaderLu({ size = 35 }) {
  return (
    <div className="w-full flex justify-center items-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <ClipLoader size={size} color="#ff2056" />
    </div>
  );
}
