import { Outlet } from "react-router-dom";
import image from "@/assets/img1.png";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f7fafa]">
      {/* Background Image Layer */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-right pointer-events-none select-none"
      />

      {/* Content Overlay Layer with Login Form on Left / Center-Left */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center lg:justify-start p-4 sm:p-6 md:p-10 lg:pl-16 xl:pl-24">
        <div className="w-full max-w-md lg:max-w-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}


